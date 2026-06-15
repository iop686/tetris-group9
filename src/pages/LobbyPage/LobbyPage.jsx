import React from 'react';
import AdBanner from '../../components/ui/AdBanner/AdBanner';
import './LobbyPage.css';

const MENU_ITEMS = [
  {
    label: 'PLAY',
    sub: '게임을 시작하고 최고 점수에 도전하세요',
    accent: '#3b82f6',
  },
  {
    label: 'RULE',
    sub: '게임 규칙과 조작법을 확인하세요',
    accent: '#8b5cf6',
  },
  {
    label: 'SETTINGS',
    sub: '컨트롤과 게임 설정을 변경하세요',
    accent: '#10b981',
  },
];

function LobbyPage({ onPlay, onRule, onSettings }) {
  const handlers = [onPlay, onRule, onSettings];

  return (
    <main className="home-main">
      <div className="home-menu-list">
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.label}
            className="home-menu-card"
            style={{ '--accent': item.accent }}
            onClick={handlers[i]}
          >
            <div className="card-icon">
              {item.label.slice(0, 2)}
            </div>
            <div className="card-text">
              <span className="card-label">{item.label}</span>
              <span className="card-sub">{item.sub}</span>
            </div>
          </button>
        ))}
      </div>
      <AdBanner type="horizontal" />
    </main>
  );
}

export default LobbyPage;