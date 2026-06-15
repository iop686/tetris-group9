import React, { useRef, useEffect } from 'react';
import GameDisplay from '../../components/tetris/GameDisplay/GameDisplay';
import AdBanner from '../../components/ui/AdBanner/AdBanner';
import useTetrisEngine from '../../engine/useTetrisEngine';
import './TetrisPage.css';

const DEFAULT_KEYMAP = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  down: 'ArrowDown',
  rotate: 'ArrowUp',
  drop: 'Space',
};

function TetrisPage({ currentUser, openAuthModal, showAlert, settings = {}, isGuest }) {
  const canvasRef = useRef(null);
  const nextCanvasRefs = useRef([useRef(null), useRef(null), useRef(null), useRef(null)]).current;

  const keymap = settings.keymap || DEFAULT_KEYMAP;

  const {
    score, lines, level, highScore, gameOver, isPaused, gameStarted,
    startGame, togglePause, playerMove, playerRotate, playerDrop, playerHardDrop
  } = useTetrisEngine(canvasRef, nextCanvasRefs, currentUser, showAlert, {
    showGhost: settings.showGhost,
    showGrid: settings.showGrid,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.querySelector('.modal-overlay')) return;

      const code = e.code;
      const usedKeys = Object.values(keymap);
      if (usedKeys.includes(code)) e.preventDefault();

      if (gameOver) {
        if (code === 'Space' || code === 'Enter') startGame();
        return;
      }

      if (code === keymap.left) playerMove(-1);
      else if (code === keymap.right) playerMove(1);
      else if (code === keymap.down) playerDrop();
      else if (code === keymap.rotate) playerRotate(1);
      else if (code === keymap.drop) playerHardDrop();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, startGame, playerMove, playerDrop, playerRotate, playerHardDrop, keymap]);

  let overlayTitle = "TETRis";
  let overlaySub = "방향키 조작 / 스페이스바 드롭\n조작키 설정에서 변경 가능\n로그인 시 최고기록 저장";
  let overlayBtnText = "게임 시작";

  if (gameOver && gameStarted) {
    overlayTitle = "GAME OVER";
    overlaySub = `최종 점수: ${score}점\n다시 도전해보세요!`;
    overlayBtnText = "다시 시작하기";
  } else if (isPaused) {
    overlayTitle = "PAUSED";
    overlaySub = "게임이 일시정지 상태입니다.";
    overlayBtnText = "게임 재개";
  }

  return (
    <main className="tetris-main-layout">
      <div className="game-area">
        <div className="game-toolbar">
          <div className="toolbar-right">
            <button className="toolbar-btn" onClick={togglePause} disabled={gameOver}>
              {isPaused ? '▶ 재개' : '⏸ 일시정지'}
            </button>
            <button className="toolbar-btn" onClick={startGame}>
              🔄 리셋
            </button>
          </div>
        </div>

        <GameDisplay
          canvasRef={canvasRef}
          nextCanvasRefs={nextCanvasRefs}
          score={score} lines={lines} level={level} highScore={highScore}
          showOverlay={gameOver || isPaused}
          overlayTitle={overlayTitle}
          overlaySub={overlaySub}
          overlayBtnText={overlayBtnText}
          onOverlayClick={isPaused ? togglePause : startGame}
        />
      </div>

      <AdBanner />
    </main>
  );
}

export default TetrisPage;