// Vercel serverless function: optional AI-powered grading.
// Only active when ANTHROPIC_API_KEY is set as an environment variable in the
// Vercel project. Without it, the frontend falls back to the local heuristic
// grader in src/lib/grader.js, so the app still works without this endpoint.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(501).json({ error: 'no_api_key', message: 'ANTHROPIC_API_KEY not configured' });
    return;
  }

  const { answerText, scenario, candidates } = req.body || {};
  if (!answerText || typeof answerText !== 'string') {
    res.status(400).json({ error: 'missing answerText' });
    return;
  }

  const candidateList = Array.isArray(candidates) ? candidates.slice(0, 8) : [];
  const candidateBlock = candidateList
    .map(
      (c) =>
        `- ${c.id}｜${c.zh}｜Skeleton: ${c.skeleton}｜可搬情境: ${(c.transferable || []).join(', ')}`,
    )
    .join('\n');

  const prompt = `你是一位香港 DSE 英文科老師，正在批改學生的英文寫作練習。

學生看到的情境／題目：${scenario?.zh || ''}（${scenario?.en || ''}）

學生用英文寫的答案（要求是描述這個情境/經歷帶來的好處或學到的東西）：
"""
${answerText}
"""

以下是本手冊中可能對應這個情境的 Master 論點候選（僅供參考，學生答案不一定要完全對應）：
${candidateBlock || '（沒有明確候選，請自行判斷）'}

請完成以下批改工作，並only以嚴格 JSON 格式回覆（不要有任何 JSON 以外的文字、不要用 markdown code fence）：
{
  "grammarIssues": [{"text": "原句中有問題的部分", "explanation": "用繁體字書面語解釋問題並給出建議", "severity": "minor"|"major"}],
  "spellingIssues": [{"word": "串錯的字", "suggestion": "建議正確串法"}],
  "bestMatchId": "最接近的 Master 編號，例如 M01，如果都不像就填 null",
  "matchConfidence": "high"|"medium"|"low",
  "matchExplanation": "用繁體字書面語解釋學生答案對應到哪個論點角度，或為何無法對應",
  "overallFeedback": "簡短繁體字書面語總評，包含具體可改善的地方，語氣鼓勵但誠實",
  "contentScore": 1到5的整數,
  "languageScore": 1到5的整數
}

注意：全部文字輸出必須使用繁體字書面語（標準書面中文），不可使用粵語口語字詞（例如「嘅」「啲」「咁」「唔」「佢」等一律不可出現）。`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      const errText = await resp.text();
      res.status(502).json({ error: 'upstream_error', detail: errText });
      return;
    }
    const data = await resp.json();
    const textBlock = (data.content || []).find((b) => b.type === 'text');
    const raw = textBlock?.text || '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(502).json({ error: 'unparseable_response', raw });
      return;
    }
    const parsed = JSON.parse(jsonMatch[0]);
    res.status(200).json({ source: 'ai', ...parsed });
  } catch (e) {
    res.status(500).json({ error: 'grade_failed', message: String(e) });
  }
}
