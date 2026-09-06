import { getState } from '../lib/store';
import { resolvePool } from '../lib/pool';
import { dueToday, unfamiliarMasters, overallStats } from '../lib/insights';
import { resolveMaster } from '../lib/masterIndex';

const REASON_LABEL = { never: '未練過', weak: '常答錯' };
const MODE_LABEL = { en: '英文情境', zh: '中文回憶', sk: 'Skeleton 重組' };

export default function HomePage({ onNavigate, onReview }) {
  const state = getState();
  const pool = resolvePool(state.selection);
  const due = dueToday(state.perMaster, pool);
  const unfamiliar = unfamiliarMasters(state.perMaster, pool, 8);
  const stats = overallStats(state.perMaster, pool);

  return (
    <div className="page">
      <div className="header" style={{ padding: 0, marginBottom: 12 }}>
        <h1>DSE 論點背誦練習</h1>
        <p>目前練習範圍：{pool.length} 個 Master（{state.selection.mode === 'custom' ? '自訂範圍' : '全部'}）</p>
      </div>

      <div className="card">
        <p className="card-title">總覽</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <Stat label="已接觸" value={stats.attempted} total={stats.total} />
          <Stat label="已熟悉" value={stats.mastered} total={stats.total} />
          <Stat label="今日待溫" value={due.length} />
        </div>
      </div>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => onNavigate('en')}>開始英文練習</button>
        <button className="btn" onClick={() => onNavigate('zh')}>開始中文回憶</button>
      </div>

      <div className="card">
        <p className="card-title">今日待溫（間隔重複到期）</p>
        {due.length === 0 && <p className="muted">暫時沒有到期需要複習的內容。</p>}
        {due.slice(0, 12).map(({ id, mode, overdue }) => {
          const m = resolveMaster(id);
          if (!m) return null;
          return (
            <div className="list-row" key={`${id}-${mode}`}>
              <div>
                <strong>{id}</strong> {m.zh}
                <div className="muted">{MODE_LABEL[mode]} · 逾期 {overdue.toFixed(1)} 天</div>
              </div>
              <button className="btn" onClick={() => onReview(id, mode)}>去複習</button>
            </div>
          );
        })}
      </div>

      <div className="card">
        <p className="card-title">較生疏 / 較少練到的角度</p>
        {unfamiliar.length === 0 && <p className="muted">目前沒有明顯生疏的 Master，繼續保持！</p>}
        {unfamiliar.map(({ id, reason }) => {
          const m = resolveMaster(id);
          if (!m) return null;
          return (
            <div className="list-row" key={id}>
              <div>
                <strong>{id}</strong> {m.zh}
                <span className="tag" style={{ marginLeft: 6 }}>{REASON_LABEL[reason]}</span>
              </div>
              <div className="btn-row">
                <button className="btn" onClick={() => onReview(id, 'en')}>情境</button>
                <button className="btn" onClick={() => onReview(id, 'sk')}>Skeleton</button>
                <button className="btn" onClick={() => onReview(id, 'zh')}>中文</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, total }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>
        {value}
        {total !== undefined && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}> / {total}</span>}
      </div>
      <div className="muted">{label}</div>
    </div>
  );
}
