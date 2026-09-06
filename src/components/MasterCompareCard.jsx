export default function MasterCompareCard({ master, hideBody }) {
  if (!master) return null;
  return (
    <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
      <p style={{ fontWeight: 700 }}>
        {master.id} {master.zh}
      </p>
      <p className="muted">{master.en}</p>

      <ul className="steps-list">
        {master.steps.map((s, i) => (
          <li key={i}>
            <span className="circle">{i + 1}.</span>
            {s}
          </li>
        ))}
      </ul>

      <div className="skeleton-text">{master.skeleton}</div>

      {!hideBody &&
        master.bodies.map((b, i) => (
          <p className="body-text" key={i}>
            {b.label && <em className="muted">（{b.label}）</em>} {b.text}
          </p>
        ))}

      {master.mergeNote && <p className="muted">{master.mergeNote}</p>}
      {master.mergedFrom?.length > 0 && (
        <p className="muted">
          包含已合併：{master.mergedFrom.map((s) => `${s.id} ${s.zh}`).join('、')}
        </p>
      )}
      {master.avoid && <p className="muted">不要硬套：{master.avoid}</p>}
      {master.transferableRaw && <p className="muted">可搬情境：{master.transferableRaw}</p>}
    </div>
  );
}
