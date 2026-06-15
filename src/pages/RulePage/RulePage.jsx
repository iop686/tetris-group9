import React from 'react';
import AdBanner from '../../components/ui/AdBanner/AdBanner';
import './RulePage.css';

const PIECES = [
  { name: 'I', color: '#00f0f0', blocks: [[1,1,1,1]] },
  { name: 'O', color: '#f0f000', blocks: [[1,1],[1,1]] },
  { name: 'T', color: '#a000f0', blocks: [[0,1,0],[1,1,1]] },
  { name: 'S', color: '#00f000', blocks: [[0,1,1],[1,1,0]] },
  { name: 'Z', color: '#f00000', blocks: [[1,1,0],[0,1,1]] },
  { name: 'L', color: '#f0a000', blocks: [[1,0],[1,0],[1,1]] },
  { name: 'J', color: '#0000f0', blocks: [[0,1],[0,1],[1,1]] },
];

const CONTROLS = [
  { key: '← →', desc: '블록 좌우 이동' },
  { key: '↑', desc: '블록 회전' },
  { key: '↓', desc: '블록 빠르게 하강' },
  { key: 'SPACE', desc: '하드 드롭 (즉시 낙하)' },
];

const SCORING = [
  { condition: '1줄 제거', score: '10점' },
  { condition: '2줄 동시 제거', score: '30점' },
  { condition: '3줄 동시 제거', score: '70점' },
  { condition: '4줄 동시 제거', score: '150점' },
];

function PiecePreview({ piece }) {
  const cellSize = 16;
  const w = piece.blocks[0].length * cellSize;
  const h = piece.blocks.length * cellSize;
  return (
    <svg width={w} height={h}>
      {piece.blocks.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${y}-${x}`}
              x={x * cellSize} y={y * cellSize}
              width={cellSize - 1} height={cellSize - 1}
              fill={piece.color}
              rx={2}
            />
          ) : null
        )
      )}
    </svg>
  );
}

function RulePage({ onBack }) {
  return (
    <main className="rule-main">
      <div className="rule-content">
        <button className="back-btn" onClick={onBack}>← 뒤로</button>
        <h2 className="rule-title">RULE</h2>

        <section className="rule-section">
          <h3>게임 목표</h3>
          <p>블록을 쌓아 가로줄을 완성하면 줄이 제거됩니다. 블록이 화면 상단에 닿으면 게임이 종료됩니다. 최대한 많은 줄을 제거해 높은 점수를 획득하세요.</p>
        </section>

        <section className="rule-section">
          <h3>블록 종류</h3>
          <div className="pieces-grid">
            {PIECES.map(p => (
              <div key={p.name} className="piece-item">
                <PiecePreview piece={p} />
                <span className="piece-name" style={{ color: p.color }}>{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rule-section">
          <div className="rule-section-header">
            <h3>조작법</h3>
            <span className="rule-section-note">기본 설정 키 · 설정에서 변경 가능</span>
          </div>
          <div className="controls-list">
            {CONTROLS.map(c => (
              <div key={c.key} className="control-row">
                <kbd className="key-badge">{c.key}</kbd>
                <span>{c.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rule-section">
          <h3>점수 시스템</h3>
          <div className="scoring-list">
            {SCORING.map(s => (
              <div key={s.condition} className="score-row">
                <span className="score-condition">{s.condition}</span>
                <span className="score-point">{s.score}</span>
              </div>
            ))}
          </div>
          <p className="score-note">* 동시에 여러 줄을 제거할수록 점수가 배로 증가합니다.</p>
        </section>

        <section className="rule-section">
          <h3>레벨 & 속도</h3>
          <p>10줄을 제거할 때마다 레벨이 1 올라가고, 블록 낙하 속도가 빨라집니다.<br />최고 속도는 레벨 10 (100ms 간격)입니다.</p>
        </section>

        <section className="rule-section">
          <h3>최고 기록</h3>
          <p>로그인한 유저의 최고 점수는 자동으로 저장됩니다.<br />게스트 플레이 시 기록은 저장되지 않습니다.</p>
        </section>
      </div>

      <AdBanner />
    </main>
  );
}

export default RulePage;