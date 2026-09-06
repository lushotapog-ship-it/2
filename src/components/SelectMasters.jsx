import { useMemo } from 'react';
import { MASTERS, MERGED_STUBS, ALL_IDS, isMergedId, mergedTargetOf } from '../lib/masterIndex';
import { priorityTiers } from '../data/appendix';
import { getState, setSelection, resetAllProgress } from '../lib/store';

function groupByPart() {
  const groups = new Map();
  for (const id of ALL_IDS) {
    const master = MASTERS.find((m) => m.id === id);
    const stub = MERGED_STUBS.find((s) => s.id === id);
    const partNum = master ? master.part?.num : MASTERS.find((m) => m.id === stub?.mergedInto)?.part?.num;
    const key = partNum || '?';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(id);
  }
  return [...groups.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
}

export default function SelectMasters() {
  const state = getState();
  const selection = state.selection;
  const grouped = useMemo(groupByPart, []);

  function toggleId(id) {
    if (isMergedId(id)) return;
    const set = new Set(selection.customIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    setSelection({ mode: 'custom', customIds: [...set] });
  }

  function selectTier(tierIds) {
    setSelection({ mode: 'custom', customIds: tierIds });
  }

  function selectAll() {
    setSelection({ mode: 'all', customIds: [] });
  }

  return (
    <div className="page">
      <div className="header" style={{ padding: 0, marginBottom: 12 }}>
        <h1>練習範圍設定</h1>
        <p>可以只練自己已經溫過/想溫的編號，避免抽到還沒背的部分。</p>
      </div>

      <div className="card">
        <p className="card-title">快速選擇</p>
        <div className="btn-row" style={{ flexWrap: 'wrap' }}>
          <button className={`pill-btn ${selection.mode === 'all' ? 'active' : ''}`} onClick={selectAll}>
            全部 87 個
          </button>
          <button className="pill-btn" onClick={() => selectTier(priorityTiers.tier1.ids)}>
            {priorityTiers.tier1.label}
          </button>
          <button className="pill-btn" onClick={() => selectTier([...priorityTiers.tier1.ids, ...priorityTiers.tier2.ids])}>
            第一 + 二批
          </button>
        </div>
      </div>

      <div className="card">
        <p className="card-title">目前範圍：{selection.mode === 'all' ? '全部 87 個' : `自訂 ${selection.customIds.length} 個`}</p>
        {grouped.map(([part, ids]) => (
          <div key={part} style={{ marginBottom: 12 }}>
            <p className="muted">Part {part}</p>
            <div className="checkbox-grid">
              {ids.map((id) => {
                const merged = isMergedId(id);
                const checked = selection.mode === 'all' || selection.customIds.includes(id);
                return (
                  <label
                    key={id}
                    className={`${checked && !merged ? 'checked' : ''} ${merged ? 'disabled' : ''}`}
                    onClick={() => toggleId(id)}
                    title={merged ? `已併入 ${mergedTargetOf(id)}` : ''}
                  >
                    {id}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title">重設</p>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (confirm('確定要清除所有練習紀錄嗎？此動作無法復原。')) resetAllProgress();
          }}
        >
          清除所有進度紀錄
        </button>
      </div>
    </div>
  );
}
