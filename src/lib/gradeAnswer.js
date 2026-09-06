import { MASTERS } from './masterIndex';
import { gradeLocally } from './grader';

async function tryAIGrade(answerText, candidateIds, scenario) {
  const candidates = candidateIds
    .map((id) => MASTERS.find((m) => m.id === id))
    .filter(Boolean)
    .map((m) => ({ id: m.id, zh: m.zh, skeleton: m.skeleton, transferable: m.transferable }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const resp = await fetch('/api/grade', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answerText, scenario, candidates }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.error) return null;
    return data;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

// Tries the optional AI grading endpoint first (only works if the Vercel deployment
// has ANTHROPIC_API_KEY configured); falls back to the local heuristic grader
// (spelling dictionary + basic grammar rules + keyword-overlap Master matching)
// whenever the endpoint is missing, times out, or errors — so the app always works.
export async function gradeAnswer(answerText, candidateIds, scenario) {
  const ai = await tryAIGrade(answerText, candidateIds, scenario);
  if (ai) return ai;
  return gradeLocally(answerText, candidateIds);
}
