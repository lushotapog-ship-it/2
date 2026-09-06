import { useEffect, useState } from 'react';
import { resolveMaster } from '../lib/masterIndex';
import { getState, getCard, updateCard } from '../lib/store';
import { reviewCard } from '../lib/srs';
import MasterCompareCard from './MasterCompareCard.jsx';

function weightedPickMaster(ids, perMaster) {
  if (!ids.length) return null;
  const weights = ids.map((id) => {
    const seen = perMaster[id]?.sk?.seen || 0;
    return 1 / (1 + seen);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < ids.length; i++) {
    r -= weights[i];
    if (r <= 0) return ids[i];
  }
  return ids[ids.length - 1];
}

// Middle-layer drill matching the handbook's own "三層背誦法": show only the
// English Skeleton (keyword chain), have the learner reconstruct a sentence
// or two from it, then reveal the real Body to compare — much lighter than
// writing a full scenario paragraph, good for first-pass memorisation.
export default function PracticeSkeleton({ poolIds, forcedMasterId, onConsumeForced }) {
  const [masterId, setMasterId] = useState(null);
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);

  function newMaster() {
    const st = getState();
    const id = weightedPickMaster(poolIds, st.perMaster);
    if (!id) return;
    setMasterId(id);
    setDraft('');
    setRevealed(false);
  }

  useEffect(() => {
    if (forcedMasterId) {
      const m = resolveMaster(forcedMasterId);
      if (m) {
        setMasterId(m.id);
        setDraft('');
        setRevealed(false);
      }
      onConsumeForced?.();
      return;
    }
    newMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const master = masterId ? resolveMaster(masterId) : null;
  if (!master) return <p className="muted">暫時沒有可用的 Master。</p>;

  function rate(good) {
    const card = getCard(masterId, 'sk');
    updateCard(masterId, 'sk', reviewCard(card, good));
    newMaster();
  }

  return (
    <>
      <div className="card">
        <p className="card-title">{master.id} 的 Skeleton</p>
        <div className="skeleton-text">{master.skeleton}</div>
        <p className="muted">看著這幾個關鍵詞，寫一兩句英文（不用整段），組出合理的意思和文法就可以。</p>
      </div>

      <div className="card">
        <textarea
          className="answer-box"
          placeholder="用這幾個關鍵詞造一兩句英文…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{ minHeight: 70 }}
        />
        {!revealed ? (
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={() => setRevealed(true)}>
            核對答案
          </button>
        ) : (
          <>
            <MasterCompareCard master={master} />
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn btn-success" onClick={() => rate(true)}>組得不錯</button>
              <button className="btn btn-danger" onClick={() => rate(false)}>仍需加強，下次再溫</button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <button className="btn" onClick={newMaster}>換一個 Master（可重複練習）</button>
      </div>
    </>
  );
}
