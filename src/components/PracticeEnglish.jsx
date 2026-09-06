import { useEffect, useMemo, useState } from 'react';
import { ALL_TOPICS, TOPIC_CATEGORIES, topicKey } from '../lib/topics';
import { candidateMastersForTopic, resolveMaster } from '../lib/masterIndex';
import { resolvePool, pickRandom } from '../lib/pool';
import { getState, logScenarioAttempt, recordMisspellings, recordWrongAnswer, updateCard, getCard } from '../lib/store';
import { reviewCard } from '../lib/srs';
import { gradeAnswer } from '../lib/gradeAnswer';
import MasterCompareCard from './MasterCompareCard.jsx';
import PracticeSkeleton from './PracticeSkeleton.jsx';

function weightedPickTopic(pool, scenarioLog) {
  if (!pool.length) return null;
  const weights = pool.map((t) => {
    const log = scenarioLog[topicKey(t)];
    const count = log ? Object.values(log.masterCounts).reduce((a, b) => a + b, 0) : 0;
    return 1 / (1 + count);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export default function PracticeEnglish({ forcedMasterId, forcedSubMode, onConsumeForced }) {
  const state = getState();
  const poolIds = useMemo(() => resolvePool(state.selection), [state.selection]);
  const [subMode, setSubMode] = useState(forcedSubMode || 'scenario');
  const [activeCats, setActiveCats] = useState([]);
  const [topic, setTopic] = useState(null);
  const [candidateIds, setCandidateIds] = useState([]);
  const [answer, setAnswer] = useState('');
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState(null);
  const [chosenMasterId, setChosenMasterId] = useState(null);

  const topicPool = useMemo(() => {
    const withCandidates = ALL_TOPICS.map((t) => ({ t, cands: candidateMastersForTopic(t.en) }))
      .filter(({ cands }) => cands.some((id) => poolIds.includes(id)));
    const filtered = activeCats.length ? withCandidates.filter(({ t }) => activeCats.includes(t.categoryLetter)) : withCandidates;
    return filtered.length ? filtered : withCandidates;
  }, [poolIds, activeCats]);

  function newTopic() {
    const st = getState();
    const pick = weightedPickTopic(
      topicPool.map((x) => x.t),
      st.scenarioLog,
    );
    if (!pick) return;
    const cands = candidateMastersForTopic(pick.en).filter((id) => poolIds.includes(id));
    setTopic(pick);
    setCandidateIds(cands.length ? cands : candidateMastersForTopic(pick.en));
    setAnswer('');
    setResult(null);
    setChosenMasterId(null);
  }

  useEffect(() => {
    if (subMode !== 'scenario') return;
    if (forcedMasterId) {
      const m = resolveMaster(forcedMasterId);
      if (m) {
        const relatedTopic = ALL_TOPICS.find((t) => (m.transferable || []).some((tag) => t.en.toLowerCase().includes(tag.toLowerCase())));
        setTopic(relatedTopic || pickRandom(ALL_TOPICS));
        setCandidateIds([m.id]);
        setAnswer('');
        setResult(null);
        setChosenMasterId(m.id);
      }
      onConsumeForced?.();
      return;
    }
    newTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subMode]);

  const tKey = topic ? topicKey(topic) : null;
  const log = tKey ? getState().scenarioLog[tKey] : null;
  const answeredCounts = log?.masterCounts || {};
  const unansweredCandidates = candidateIds.filter((id) => !answeredCounts[id]);

  async function submit() {
    if (!answer.trim()) return;
    setGrading(true);
    const graded = await gradeAnswer(answer, candidateIds, { zh: topic.zh, en: topic.en });
    setGrading(false);
    setResult(graded);
    const guessedId = graded.source === 'ai' ? graded.bestMatchId : graded.bestMatch?.id;
    setChosenMasterId(guessedId || candidateIds[0] || null);
    const words = graded.source === 'ai' ? (graded.spellingIssues || []).map((s) => s.word) : graded.misspelled;
    if (words?.length) recordMisspellings(words);
  }

  function rate(remembered) {
    if (!chosenMasterId) return;
    const card = getCard(chosenMasterId, 'en');
    updateCard(chosenMasterId, 'en', reviewCard(card, remembered));
    logScenarioAttempt(tKey, chosenMasterId, 'en');
    if (!remembered) {
      recordWrongAnswer({
        mode: 'en',
        topicKey: tKey,
        topicLabel: topic.zh,
        masterId: chosenMasterId,
        answerText: answer,
        issues: result?.grammarIssues || result?.issues || [],
      });
    }
    newTopic();
  }

  const chosenMaster = chosenMasterId ? resolveMaster(chosenMasterId) : null;

  return (
    <div className="page">
      <div className="header" style={{ padding: 0, marginBottom: 12 }}>
        <h1>英文練習</h1>
        <p>
          {subMode === 'scenario'
            ? '寫出這個情境帶來的好處或學到的東西，系統會批改文法/串字，並猜你答的是哪個角度。'
            : '只看英文 Skeleton 關鍵詞，練習當場組出一兩句英文，再跟真正的 Body 核對——比整段情境輕鬆，適合還不熟的時候先打底。'}
        </p>
      </div>

      <div className="btn-row" style={{ marginBottom: 12 }}>
        <button className={`pill-btn ${subMode === 'scenario' ? 'active' : ''}`} onClick={() => setSubMode('scenario')}>
          情境作文
        </button>
        <button className={`pill-btn ${subMode === 'skeleton' ? 'active' : ''}`} onClick={() => setSubMode('skeleton')}>
          Skeleton 重組
        </button>
      </div>

      {subMode === 'skeleton' ? (
        <PracticeSkeleton
          poolIds={poolIds}
          forcedMasterId={forcedSubMode === 'skeleton' ? forcedMasterId : null}
          onConsumeForced={onConsumeForced}
        />
      ) : !topic ? (
        <p className="muted">暫時沒有可用的情境。</p>
      ) : (
        <>
      <div className="btn-row" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
        {TOPIC_CATEGORIES.map((c) => (
          <button
            key={c.letter}
            className={`pill-btn ${activeCats.includes(c.letter) ? 'active' : ''}`}
            onClick={() =>
              setActiveCats((prev) => (prev.includes(c.letter) ? prev.filter((x) => x !== c.letter) : [...prev, c.letter]))
            }
          >
            {c.letter}. {c.zh}
          </button>
        ))}
      </div>

      <div className="card">
        <p className="card-title">情境（範疇 {topic.categoryLetter}. {topic.categoryZh}）</p>
        <p style={{ fontSize: 17, fontWeight: 600 }}>{topic.zh}</p>
        <p className="muted">{topic.en}</p>
        <button className="btn" onClick={newTopic}>換一個情境</button>

        {Object.keys(answeredCounts).length > 0 && (
          <div style={{ marginTop: 10 }}>
            <p className="muted">你在此情境已答過的角度：</p>
            {Object.entries(answeredCounts).map(([id, count]) => {
              const m = resolveMaster(id);
              return (
                <span className="tag" key={id}>
                  {id} {m?.zh}（{count} 次）
                </span>
              );
            })}
          </div>
        )}
        {unansweredCandidates.length > 0 && (
          <div style={{ marginTop: 6 }}>
            <p className="muted">較少練到的角度提醒：</p>
            {unansweredCandidates.map((id) => {
              const m = resolveMaster(id);
              return (
                <span className="tag" key={id}>
                  {id} {m?.zh}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <textarea
          className="answer-box"
          placeholder="用英文寫出這個經歷/安排帶來的好處…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <div className="btn-row" style={{ marginTop: 10 }}>
          <button className="btn btn-primary" onClick={submit} disabled={grading || !answer.trim()}>
            {grading ? '批改中…' : '提交批改'}
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <p className="card-title">批改結果 {result.source === 'ai' ? '（AI 批改）' : '（本機規則批改）'}</p>

          {result.source === 'ai' ? (
            <AIResultView result={result} />
          ) : (
            <HeuristicResultView result={result} />
          )}

          <div style={{ marginTop: 12 }}>
            <p className="muted">系統判斷你這次比較接近哪個 Master：</p>
            <select
              value={chosenMasterId || ''}
              onChange={(e) => setChosenMasterId(e.target.value)}
              style={{ padding: 8, borderRadius: 8, width: '100%' }}
            >
              <option value="">（不確定 / 都不像）</option>
              {candidateIds.map((id) => {
                const m = resolveMaster(id);
                return (
                  <option key={id} value={id}>
                    {id} {m?.zh}
                  </option>
                );
              })}
            </select>
          </div>

          {chosenMaster && <MasterCompareCard master={chosenMaster} />}

          <div className="btn-row" style={{ marginTop: 12 }}>
            <button className="btn btn-success" onClick={() => rate(true)}>已掌握這個角度</button>
            <button className="btn btn-danger" onClick={() => rate(false)}>仍需加強，下次再溫</button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

function AIResultView({ result }) {
  return (
    <>
      {result.contentScore && (
        <p>
          內容分（參考）：{result.contentScore}/5　語言分（參考）：{result.languageScore}/5
        </p>
      )}
      {result.overallFeedback && <p className="body-text">{result.overallFeedback}</p>}
      {(result.grammarIssues || []).length > 0 && (
        <>
          <p className="card-title" style={{ marginTop: 10 }}>文法/用字建議</p>
          {result.grammarIssues.map((g, i) => (
            <p key={i} className="muted">
              「{g.text}」— {g.explanation}
            </p>
          ))}
        </>
      )}
      {(result.spellingIssues || []).length > 0 && (
        <>
          <p className="card-title" style={{ marginTop: 10 }}>可能串錯的字</p>
          {result.spellingIssues.map((s, i) => (
            <span className="tag" key={i}>
              {s.word} → {s.suggestion}
            </span>
          ))}
        </>
      )}
      {result.matchExplanation && <p className="muted" style={{ marginTop: 10 }}>{result.matchExplanation}</p>}
    </>
  );
}

function HeuristicResultView({ result }) {
  return (
    <>
      {result.misspelled.length > 0 ? (
        <>
          <p className="card-title">可能串錯的字（字典比對，僅供參考）</p>
          {result.misspelled.map((w) => (
            <span className="tag" key={w}>{w}</span>
          ))}
        </>
      ) : (
        <p className="muted">沒有偵測到明顯的串字問題。</p>
      )}
      {result.grammarIssues.length > 0 ? (
        <>
          <p className="card-title" style={{ marginTop: 10 }}>基本檢查（非完整文法批改）</p>
          {result.grammarIssues.map((g, i) => (
            <p key={i} className="muted">{g.message}</p>
          ))}
        </>
      ) : (
        <p className="muted">基本檢查沒有發現明顯問題。</p>
      )}
      {!result.bestMatch && <p className="muted">系統無法判斷你答的是哪個角度，可以自己在下面選擇。</p>}
    </>
  );
}
