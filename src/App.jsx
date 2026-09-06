import { useEffect, useState } from 'react';
import { Home, PenLine, Brain, BookOpen, AlertCircle, Settings, Library } from 'lucide-react';
import { loadStore, useStore } from './lib/store';
import { warmSpellcheck } from './lib/spellcheck';
import HomePage from './components/HomePage.jsx';
import PracticeEnglish from './components/PracticeEnglish.jsx';
import PracticeChinese from './components/PracticeChinese.jsx';
import MasterBrowser from './components/MasterBrowser.jsx';
import WrongBook from './components/WrongBook.jsx';
import SelectMasters from './components/SelectMasters.jsx';
import Reference from './components/Reference.jsx';

const TABS = [
  { id: 'home', label: '首頁', icon: Home },
  { id: 'en', label: '英文練習', icon: PenLine },
  { id: 'zh', label: '中文回憶', icon: Brain },
  { id: 'browse', label: '手冊', icon: Library },
  { id: 'wrong', label: '錯題本', icon: AlertCircle },
  { id: 'ref', label: '參考', icon: BookOpen },
  { id: 'settings', label: '範圍', icon: Settings },
];

export default function App() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('home');
  const [pendingReviewId, setPendingReviewId] = useState(null);

  useEffect(() => {
    loadStore().then(() => setReady(true));
    warmSpellcheck();
  }, []);

  useStore(); // re-render on store changes

  if (!ready) {
    return <div className="loading-screen">載入進度資料中…</div>;
  }

  function goReview(id, mode) {
    setPendingReviewId(id);
    setTab(mode === 'zh' ? 'zh' : 'en');
  }

  return (
    <>
      {tab === 'home' && <HomePage onNavigate={setTab} onReview={goReview} />}
      {tab === 'en' && (
        <PracticeEnglish forcedMasterId={pendingReviewId} onConsumeForced={() => setPendingReviewId(null)} />
      )}
      {tab === 'zh' && (
        <PracticeChinese forcedMasterId={pendingReviewId} onConsumeForced={() => setPendingReviewId(null)} />
      )}
      {tab === 'browse' && <MasterBrowser />}
      {tab === 'wrong' && <WrongBook />}
      {tab === 'ref' && <Reference />}
      {tab === 'settings' && <SelectMasters />}

      <nav className="navbar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
