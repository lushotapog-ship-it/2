import { useMemo, useState } from 'react';
import { MASTERS } from '../lib/masterIndex';
import MasterCompareCard from './MasterCompareCard.jsx';

const PARTS = [...new Set(MASTERS.map((m) => m.part?.num))].filter(Boolean).sort((a, b) => Number(a) - Number(b));

export default function MasterBrowser() {
  const [query, setQuery] = useState('');
  const [part, setPart] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MASTERS.filter((m) => {
      if (part && m.part?.num !== part) return false;
      if (!q) return true;
      return (
        m.id.toLowerCase().includes(q) ||
        m.zh.toLowerCase().includes(q) ||
        m.en.toLowerCase().includes(q) ||
        (m.transferableRaw || '').toLowerCase().includes(q)
      );
    });
  }, [query, part]);

  return (
    <div className="page">
      <div className="header" style={{ padding: 0, marginBottom: 12 }}>
        <h1>Master 手冊瀏覽</h1>
        <p>共 87 個編號（83 個獨立內容，4 個已併入其他 Master）。</p>
      </div>

      <div className="card">
        <input
          placeholder="搜尋編號、中文、英文或情境關鍵詞…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }}
        />
        <div className="btn-row" style={{ flexWrap: 'wrap' }}>
          <button className={`pill-btn ${part === '' ? 'active' : ''}`} onClick={() => setPart('')}>全部</button>
          {PARTS.map((p) => (
            <button key={p} className={`pill-btn ${part === p ? 'active' : ''}`} onClick={() => setPart(p)}>
              Part {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.map((m) => (
        <div className="card" key={m.id} onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{m.id}</strong> {m.zh}
              <div className="muted">{m.en}</div>
            </div>
            <span className="tag">第{m.tier}批</span>
          </div>
          {expanded === m.id && <MasterCompareCard master={m} />}
        </div>
      ))}
    </div>
  );
}
