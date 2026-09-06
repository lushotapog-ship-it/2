import { useState } from 'react';
import { appendixA, appendixB, appendixC, appendixD } from '../data/appendix';

const TABS = [
  { id: 'A', label: '附錄 A 首句公式' },
  { id: 'B', label: '附錄 B 文體範本' },
  { id: 'C', label: '附錄 C 句式連接詞' },
  { id: 'D', label: '附錄 D 考場技巧' },
];

export default function Reference() {
  const [tab, setTab] = useState('A');

  return (
    <div className="page">
      <div className="header" style={{ padding: 0, marginBottom: 12 }}>
        <h1>參考手冊</h1>
        <p>這幾頁跟 Content 分無關，但直接影響 Organisation 和 Language 分，考前值得先背熟。</p>
      </div>

      <div className="btn-row" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button key={t.id} className={`pill-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'A' && <SectionA />}
      {tab === 'B' && <SectionB />}
      {tab === 'C' && <SectionC />}
      {tab === 'D' && <SectionD />}
    </div>
  );
}

function SectionA() {
  const a = appendixA;
  return (
    <div className="card">
      <p className="card-title">{a.title}</p>
      <p className="body-text">{a.intro}</p>
      {a.steps.map((s, i) => (
        <p key={i}><strong>{s.step}</strong>　{s.text}</p>
      ))}
      <p className="section-title">四個萬用扣題句型</p>
      {a.universalSentences.map((s, i) => (
        <p key={i} className="body-text">{s}</p>
      ))}
      <p className="section-title">示範：同一段 M01，套四個不同題目</p>
      {a.demoTable.map((row, i) => (
        <p key={i} className="muted"><strong>{row.topic}</strong><br />{row.rewrite}</p>
      ))}
      <p className="section-title">完整示範</p>
      <p className="muted">{a.fullDemo.topic}</p>
      <p className="body-text">{a.fullDemo.text}</p>
      <p className="muted">{a.fullDemo.note}</p>
      <p className="section-title">反面提醒</p>
      <p className="body-text">{a.warning}</p>
    </div>
  );
}

function SectionB() {
  const b = appendixB;
  return (
    <>
      <div className="card">
        <p className="card-title">{b.title}</p>
        <p className="body-text">{b.intro}</p>
      </div>
      <div className="card">
        <p className="section-title">{b.openingFormula.title}</p>
        {b.openingFormula.sentences.map((s, i) => (
          <p key={i}><strong>{s.fn}</strong>　{s.pattern}</p>
        ))}
        <p className="muted" style={{ whiteSpace: 'pre-wrap' }}>{b.openingFormula.example}</p>
      </div>
      <div className="card">
        <p className="section-title">{b.closingFormula.title}</p>
        {b.closingFormula.sentences.map((s, i) => (
          <p key={i} style={{ whiteSpace: 'pre-wrap' }}><strong>{s.fn}</strong>　{s.pattern}</p>
        ))}
      </div>
      {b.genres.map((g) => (
        <div className="card" key={g.name}>
          <p className="section-title">{g.name}</p>
          <p className="muted">{g.note}</p>
          <p className="body-text" style={{ whiteSpace: 'pre-wrap' }}>開：{g.opening}</p>
          <p className="body-text" style={{ whiteSpace: 'pre-wrap' }}>結：{g.closing}</p>
        </div>
      ))}
      <div className="card">
        <p className="muted">{b.signOffRule}</p>
      </div>
      <div className="card">
        <p className="section-title">{b.assemblyExample.title}</p>
        {b.assemblyExample.paragraphs.map((p, i) => (
          <p key={i} className="body-text">{p}</p>
        ))}
      </div>
    </>
  );
}

function SectionC() {
  const c = appendixC;
  return (
    <>
      <div className="card">
        <p className="card-title">{c.title}</p>
        <p className="body-text">{c.intro}</p>
        {c.sentencePatterns.map((p, i) => (
          <p key={i}><strong>{p.pattern}</strong><br /><span className="muted">{p.example}</span></p>
        ))}
      </div>
      <div className="card">
        <p className="section-title">{c.whatGrammarNote.title}</p>
        {c.whatGrammarNote.examples.map((e, i) => (
          <p key={i} className="muted">· {e}</p>
        ))}
        <p className="body-text">{c.whatGrammarNote.commonError}</p>
        <p className="section-title">高分句型</p>
        {c.whatGrammarNote.highScorePatterns.map((s, i) => (
          <p key={i}>{s}</p>
        ))}
      </div>
      <div className="card">
        <p className="section-title">{c.connectives.title}</p>
        {c.connectives.groups.map((g) => (
          <p key={g.label}><strong>{g.label}</strong>　{g.items.join(' / ')}</p>
        ))}
      </div>
    </>
  );
}

function SectionD() {
  const d = appendixD;
  return (
    <>
      <div className="card">
        <p className="card-title">{d.title}</p>
        <p className="section-title">{d.threeLayerMethod.title}</p>
        <p className="body-text">{d.threeLayerMethod.text}</p>
      </div>
      <div className="card">
        <p className="section-title">{d.matchFormula.title}</p>
        {d.matchFormula.steps.map((s, i) => (
          <p key={i}><strong>{s.step}</strong>　{s.text}</p>
        ))}
      </div>
      <div className="card">
        <p className="section-title">{d.oppositePairs.title}</p>
        {d.oppositePairs.pairs.map((p, i) => (
          <p key={i} className="body-text">{p}</p>
        ))}
      </div>
      <div className="card">
        <p className="section-title">{d.speakingCompression.title}</p>
        <p className="body-text">{d.speakingCompression.text}</p>
        <p className="muted">{d.speakingCompression.example}</p>
        <p className="body-text">{d.speakingCompression.note}</p>
      </div>
    </>
  );
}
