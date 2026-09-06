import { getState } from '../lib/store';
import { resolvePool } from '../lib/pool';
import { unfamiliarMasters, topMisspellings } from '../lib/insights';
import { resolveMaster } from '../lib/masterIndex';

export default function WrongBook() {
  const state = getState();
  const poolIds = resolvePool(state.selection);
  const weak = unfamiliarMasters(state.perMaster, poolIds, 30);
  const misspellings = topMisspellings(state.misspellings, 40);
  const recentWrong = [...state.wrongAnswers].reverse().slice(0, 20);

  return (
    <div className="page">
      <div className="header" style={{ padding: 0, marginBottom: 12 }}>
        <h1>錯題本 / 生字本</h1>
        <p>自動記錄你較弱的角度、常拼錯的字，以及最近答錯的紀錄。</p>
      </div>

      <div className="card">
        <p className="card-title">常拼錯的字（依次數排序）</p>
        {misspellings.length === 0 && <p className="muted">目前還沒有紀錄。</p>}
        {misspellings.map(({ word, count }) => (
          <span className="tag" key={word}>
            {word} × {count}
          </span>
        ))}
      </div>

      <div className="card">
        <p className="card-title">未練過 / 常答錯的 Master</p>
        {weak.length === 0 && <p className="muted">目前沒有明顯弱點。</p>}
        {weak.map(({ id, reason }) => {
          const m = resolveMaster(id);
          if (!m) return null;
          return (
            <div className="list-row" key={id}>
              <div>
                <strong>{id}</strong> {m.zh}
              </div>
              <span className="tag">{reason === 'never' ? '未練過' : '常答錯'}</span>
            </div>
          );
        })}
      </div>

      <div className="card">
        <p className="card-title">最近答錯紀錄</p>
        {recentWrong.length === 0 && <p className="muted">目前還沒有紀錄。</p>}
        {recentWrong.map((w, i) => {
          const m = w.masterId ? resolveMaster(w.masterId) : null;
          return (
            <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
              <p className="muted">
                {new Date(w.ts).toLocaleString('zh-Hant-HK', { hour12: false })} · {w.mode === 'en' ? '英文' : '中文'} · {w.topicLabel}
              </p>
              {m && <p><strong>{m.id}</strong> {m.zh}</p>}
              {w.answerText && <p className="body-text muted">{w.answerText}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
