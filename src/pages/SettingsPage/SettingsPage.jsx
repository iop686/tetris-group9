import React, { useState } from 'react';
import './SettingsPage.css';

const DEFAULT_KEYMAP = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  down: 'ArrowDown',
  rotate: 'ArrowUp',
  drop: 'Space',
};

const KEY_LABELS = {
  left: '왼쪽 이동',
  right: '오른쪽 이동',
  down: '아래로',
  rotate: '회전',
  drop: '하드 드롭',
};

// 키 코드를 보기 좋은 이름으로 변환
function prettyKey(code) {
  const map = {
    ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓',
    Space: 'Space', Enter: 'Enter',
  };
  if (map[code]) return map[code];
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return code;
}

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`toggle ${checked ? 'toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="toggle-knob" />
    </button>
  );
}

function SettingsPage({ settings, onChange, onBack }) {
  const [listening, setListening] = useState(null); // 현재 키 입력 대기 중인 항목
  const keymap = settings.keymap || DEFAULT_KEYMAP;

  const update = (key, value) => {
    onChange({ ...settings, [key]: value });
  };

  // 키 변경 대기 상태에서 키 입력 받기
  const handleKeyCapture = (e, action) => {
    e.preventDefault();
    const code = e.code;
    // 중복 키 방지: 이미 다른 액션에 할당된 키면 무시
    const isDuplicate = Object.entries(keymap).some(([k, v]) => k !== action && v === code);
    if (isDuplicate) {
      setListening(null);
      return;
    }
    onChange({ ...settings, keymap: { ...keymap, [action]: code } });
    setListening(null);
  };

  const resetKeys = () => {
    onChange({ ...settings, keymap: DEFAULT_KEYMAP });
  };

  return (
    <main className="settings-main">
      <div className="settings-content">
        <button className="back-btn" onClick={onBack}>← 뒤로</button>
        <h2 className="settings-title">SETTINGS</h2>

        <section className="settings-section">
          <h3>게임 설정</h3>

          <div className="setting-row">
            <div className="setting-info">
              <p className="setting-name">고스트 피스</p>
              <p className="setting-desc">블록이 떨어질 위치를 미리 표시합니다</p>
            </div>
            <Toggle checked={settings.showGhost !== false} onChange={(v) => update('showGhost', v)} />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <p className="setting-name">그리드 표시</p>
              <p className="setting-desc">게임판에 격자무늬를 표시합니다</p>
            </div>
            <Toggle checked={settings.showGrid !== false} onChange={(v) => update('showGrid', v)} />
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <h3>조작키 설정</h3>
            <button className="reset-keys-btn" onClick={resetKeys}>기본값으로</button>
          </div>

          {Object.keys(KEY_LABELS).map((action) => (
            <div key={action} className="setting-row">
              <div className="setting-info">
                <p className="setting-name">{KEY_LABELS[action]}</p>
              </div>
              <button
                className={`key-btn ${listening === action ? 'key-btn--listening' : ''}`}
                onClick={() => setListening(action)}
                onKeyDown={listening === action ? (e) => handleKeyCapture(e, action) : undefined}
              >
                {listening === action ? '키를 누르세요...' : prettyKey(keymap[action])}
              </button>
            </div>
          ))}
          <p className="settings-hint">변경할 키를 클릭한 뒤 원하는 키를 누르세요.</p>
        </section>
      </div>
    </main>
  );
}

export default SettingsPage;