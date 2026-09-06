import { useEffect, useMemo, useState } from 'react';
import { resolveMaster } from '../lib/masterIndex';
import { resolvePool } from '../lib/pool';
import { ALL_TOPICS } from '../lib/topics';
import { getState, getCard, updateCard } from '../lib/store';
import { reviewCard } from '../lib/srs';
import MasterCompareCard from './MasterCompareCard.jsx';

function findScenarioFor(master) {
  const tags = (master.transferable || []).map((t) => t.toLowerCase());
  const matches = ALL_TOPICS.filter((t) => tags.some((tag) => t.en.toLowerCase().includes(tag) || tag.includes(t.en.toLowerCase())));
  if (matches.length) return matches[Math.floor(Math.random() * matches.length)];
  return null;
}

function weightedPickMaster(ids, perMaster) {
  if (!ids.length) return null;
  const weights = ids.map((id) => {
    const card = perMaster[id]?.zh;
    const seen = card?.seen || 0;
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

export default function PracticeChinese({ forcedMasterId, onConsumeForced }) {
  const state = getState();
  const poolIds = useMemo(() => resolvePool(state.selection), [state.selection]);
  const [masterId, setMasterId] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function newMaster() {
    const st = getState();
    const id = weightedPickMaster(poolIds, st.perMaster);
    if (!id) return;
    const m = resolveMaster(id);
    setMasterId(id);
    setScenario(findScenarioFor(m));
    setRevealed(false);
  }

  useEffect(() => {
    if (forcedMasterId) {
      const m = resolveMaster(forcedMasterId);
      if (m) {
        setMasterId(m.id);
        setScenario(findScenarioFor(m));
        setRevealed(false);
      }
      onConsumeForced?.();
      return;
    }
    newMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const master = masterId ? resolveMaster(masterId) : null;
  if (!master) return <div className="page">暫時沒有可用的 Master。</div>;

  function rate(remembered) {
    const card = getCard(masterId, 'zh');
    updateCard(masterId, 'zh', reviewCard(card, remembered));
    newMaster();
  }

  return (
    <div className="page">
      <div className="header" style={{ padding: 0, marginBottom: 12 }}>
        <h1>中文邏輯鏈回憶</h1>
        <p>只看標題和情境，在心裡（或講出聲）默想這個論點的邏輯鏈，再揭曉核對。</p>
      </div>

      <div className="card">
        <p className="card-title">{master.id} · {master.part ? `Part ${master.part.num} ${master.part.name}` : ''}</p>
        <p style={{ fontSize: 19, fontWeight: 700 }}>{master.zh}</p>
        {scenario && (
          <p className="muted">
            情境參考：{scenario.zh}（{scenario.categoryZh}）
          </p>
        )}
        <p className="muted">邏輯鏈共 {master.steps.length} 個要點，試著把它講出來或寫下來。</p>

        {!revealed ? (
          <button className="btn btn-primary" onClick={() => setRevealed(true)}>顯示邏輯鏈核對</button>
        ) : (
          <>
            <MasterCompareCard master={master} />
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn btn-success" onClick={() => rate(true)}>記得，講得出來</button>
              <button className="btn btn-danger" onClick={() => rate(false)}>忘記了，需要再溫</button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <button className="btn" onClick={newMaster}>換一個 Master（可重複練習）</button>
      </div>
    </div>
  );
}
