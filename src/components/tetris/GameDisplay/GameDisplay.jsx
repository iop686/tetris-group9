// components/GameDisplay/GameDisplay.jsx
import React, { useRef } from 'react';
import NextPreview from '../NextPreview/NextPreview';
import './GameDisplay.css';

function GameDisplay({
  canvasRef, nextCanvasRefs,
  score, lines, level, highScore,
  showOverlay, overlayTitle, overlaySub, overlayBtnText, onOverlayClick
}) {
  return (
    <div className="game-display">
      {/* 왼쪽: 게임 캔버스 */}
      <div className="game-canvas-wrap">
        <canvas ref={canvasRef} id="tetris-canvas" width="240" height="480" />
        {showOverlay && (
          <div className="game-overlay">
            <h2>{overlayTitle}</h2>
            <p>{overlaySub}</p>
            <button onClick={onOverlayClick}>{overlayBtnText}</button>
          </div>
        )}
      </div>

      {/* 오른쪽: 스코어 + 넥스트 블럭 */}
      <div className="game-info-panel">
        <div className="info-section">
          <h3>NEXT</h3>
          <NextPreview nextCanvasRefs={nextCanvasRefs} />
        </div>

        <div className="info-section stats-grid">
          <div className="stat-box">
            <label>SCORE</label>
            <div className="stat-value">{score}</div>
          </div>
          <div className="stat-box">
            <label>LINES</label>
            <div className="stat-value">{lines}</div>
          </div>
          <div className="stat-box">
            <label>LEVEL</label>
            <div className="stat-value">{level}</div>
          </div>
          <div className="stat-box">
            <label>BEST</label>
            <div className="stat-value">{highScore}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDisplay;