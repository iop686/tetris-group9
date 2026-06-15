import { useEffect, useRef, useState, useCallback } from 'react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;
const NEXT_COUNT = 4;

const SHAPES = {
  'I': [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  'L': [[0,2,0],[0,2,0],[0,2,2]],
  'J': [[0,3,0],[0,3,0],[3,3,0]],
  'O': [[4,4],[4,4]],
  'Z': [[5,5,0],[0,5,5],[0,0,0]],
  'S': [[0,6,6],[6,6,0],[0,0,0]],
  'T': [[0,7,0],[7,7,7],[0,0,0]]
};

const COLORS = [null, '#00f0f0', '#f0a000', '#0000f0', '#f0f000', '#f00000', '#00f000', '#a000f0'];
const PIECES = 'ILJOZST';

const randomPiece = () => SHAPES[PIECES[Math.floor(Math.random() * PIECES.length)]];

const collide = (arena, player) => {
  const [m, p] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y)
    for (let x = 0; x < m[y].length; ++x)
      if (m[y][x] !== 0 && (arena[y + p.y] && arena[y + p.y][x + p.x]) !== 0) return true;
  return false;
};

const merge = (arena, player) => {
  player.matrix.forEach((row, y) =>
    row.forEach((value, x) => {
      if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
    })
  );
};

const drawNextPiece = (canvas, matrix) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const minCol = matrix[0].findIndex((_, ci) => matrix.some(r => r[ci] !== 0));
  const maxCol = matrix[0].length - 1 - [...matrix[0]].reverse().findIndex((_, ci) => matrix.some(r => r[matrix[0].length - 1 - ci] !== 0));
  const minRow = matrix.findIndex(r => r.some(v => v !== 0));
  const maxRow = matrix.length - 1 - [...matrix].reverse().findIndex(r => r.some(v => v !== 0));

  const pieceW = maxCol - minCol + 1;
  const pieceH = maxRow - minRow + 1;
  const pad = 10;
  const maxBs = Math.floor(canvas.width / 6);
  const bs = Math.floor(Math.min(
    (canvas.width - pad * 2) / pieceW,
    (canvas.height - pad * 2) / pieceH,
    maxBs
  ));

  const startX = Math.floor((canvas.width - pieceW * bs) / 2);
  const startY = Math.floor((canvas.height - pieceH * bs) / 2);

  for (let y = minRow; y <= maxRow; y++) {
    for (let x = minCol; x <= maxCol; x++) {
      const value = matrix[y][x];
      if (value !== 0) {
        ctx.fillStyle = COLORS[value];
        ctx.fillRect(startX + (x - minCol) * bs + 1, startY + (y - minRow) * bs + 1, bs - 2, bs - 2);
      }
    }
  }
};

export default function useTetrisEngine(canvasRef, nextCanvasRefs, currentUser, showAlert, options = {}) {
  const { showGhost = true, showGrid = true } = options;
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const arenaRef = useRef(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const playerRef = useRef({ pos: { x: 0, y: 0 }, matrix: null, nextQueue: [] });
  const scoreRef = useRef(0);
  const gameOverRef = useRef(true);
  const isPausedRef = useRef(false);

  const lastTimeRef = useRef(0);
  const dropCounterRef = useRef(0);
  const dropIntervalRef = useRef(1000);
  const rAFRef = useRef(null);
  const showGhostRef = useRef(showGhost);
  const showGridRef = useRef(showGrid);

  useEffect(() => {
    showGhostRef.current = showGhost;
    showGridRef.current = showGrid;
  }, [showGhost, showGrid]);

  // 최고기록 키
  const highKey = () => (currentUser ? `tetris_high_${currentUser}` : 'tetris_high_guest');

  // 초기 최고기록 로드
  useEffect(() => {
    const saved = localStorage.getItem(highKey());
    setHighScore(saved ? parseInt(saved, 10) : 0);
  }, [currentUser]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawMatrix = (c, matrix, offset) => {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            c.fillStyle = COLORS[value];
            c.fillRect((x + offset.x) * BLOCK_SIZE + 1, (y + offset.y) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          }
        });
      });
    };

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (showGridRef.current) {
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * BLOCK_SIZE, 0); ctx.lineTo(i * BLOCK_SIZE, ROWS * BLOCK_SIZE); ctx.stroke();
      }
      for (let j = 0; j <= ROWS; j++) {
        ctx.beginPath(); ctx.moveTo(0, j * BLOCK_SIZE); ctx.lineTo(COLS * BLOCK_SIZE, j * BLOCK_SIZE); ctx.stroke();
      }
    }

    drawMatrix(ctx, arenaRef.current, { x: 0, y: 0 });

    // 고스트 피스
    if (showGhostRef.current && playerRef.current.matrix) {
      const ghost = {
        matrix: playerRef.current.matrix,
        pos: { x: playerRef.current.pos.x, y: playerRef.current.pos.y }
      };
      while (!collide(arenaRef.current, ghost)) ghost.pos.y++;
      ghost.pos.y--;
      if (ghost.pos.y > playerRef.current.pos.y) {
        ctx.globalAlpha = 0.25;
        drawMatrix(ctx, ghost.matrix, ghost.pos);
        ctx.globalAlpha = 1;
      }
    }

    if (playerRef.current.matrix) drawMatrix(ctx, playerRef.current.matrix, playerRef.current.pos);

    playerRef.current.nextQueue.forEach((matrix, i) => {
      const nextCanvas = nextCanvasRefs[i]?.current;
      if (nextCanvas && matrix) drawNextPiece(nextCanvas, matrix);
    });
  }, [canvasRef, nextCanvasRefs]);

  const playerReset = useCallback(() => {
    const q = playerRef.current.nextQueue;
    playerRef.current.matrix = q.shift();
    while (q.length < NEXT_COUNT) q.push(randomPiece());
    playerRef.current.pos.y = 0;
    playerRef.current.pos.x = Math.floor((COLS - playerRef.current.matrix[0].length) / 2);
    if (collide(arenaRef.current, playerRef.current)) {
      gameOverRef.current = true;
      setGameOver(true);
      // 게임오버 시 최종 점수로 최고기록 갱신 + 경신 알림
      const key = highKey();
      const currentHigh = parseInt(localStorage.getItem(key) || '0', 10);
      if (scoreRef.current > currentHigh) {
        localStorage.setItem(key, scoreRef.current.toString());
        setHighScore(scoreRef.current);
        if (currentUser) showAlert(`축하합니다! 최고 기록 경신!\n\n새로운 최고 점수: ${scoreRef.current}점`);
      }
    }
  }, [currentUser, showAlert]);

  const arenaSweep = useCallback(() => {
    let rowCount = 1;
    let clearedLines = 0;
    let scoreAdd = 0;
    outer: for (let y = arenaRef.current.length - 1; y >= 0; --y) {
      for (let x = 0; x < arenaRef.current[y].length; ++x)
        if (arenaRef.current[y][x] === 0) continue outer;
      const row = arenaRef.current.splice(y, 1)[0].fill(0);
      arenaRef.current.unshift(row);
      ++y; clearedLines++;
      scoreAdd += rowCount * 10;
      rowCount *= 2;
    }
    if (clearedLines > 0) {
      scoreRef.current += scoreAdd;
      setScore(scoreRef.current);

      // 점수 오를 때마다 최고기록 실시간 저장
      const key = highKey();
      const currentHigh = parseInt(localStorage.getItem(key) || '0', 10);
      if (scoreRef.current > currentHigh) {
        localStorage.setItem(key, scoreRef.current.toString());
        setHighScore(scoreRef.current);
      }

      setLines(prev => {
        const nextLines = prev + clearedLines;
        const nextLevel = Math.floor(nextLines / 10) + 1;
        setLevel(nextLevel);
        dropIntervalRef.current = Math.max(100, 1000 - (nextLevel - 1) * 100);
        return nextLines;
      });
    }
  }, [currentUser]);

  const playerDrop = useCallback(() => {
    if (gameOverRef.current || isPausedRef.current) return;
    playerRef.current.pos.y++;
    if (collide(arenaRef.current, playerRef.current)) {
      playerRef.current.pos.y--;
      merge(arenaRef.current, playerRef.current);
      arenaSweep();
      playerReset();
    }
    dropCounterRef.current = 0;
    draw();
  }, [playerReset, arenaSweep, draw]);

  const playerMove = useCallback((dir) => {
    if (gameOverRef.current || isPausedRef.current) return;
    playerRef.current.pos.x += dir;
    if (collide(arenaRef.current, playerRef.current)) playerRef.current.pos.x -= dir;
    draw();
  }, [draw]);

  const playerRotate = useCallback((dir) => {
    if (gameOverRef.current || isPausedRef.current) return;
    const pos = playerRef.current.pos.x;
    let offset = 1;
    const matrix = playerRef.current.matrix;
    for (let y = 0; y < matrix.length; ++y)
      for (let x = 0; x < y; ++x) [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    if (dir > 0) matrix.forEach(row => row.reverse()); else matrix.reverse();
    while (collide(arenaRef.current, playerRef.current)) {
      playerRef.current.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > playerRef.current.matrix[0].length) {
        if (dir > 0) matrix.forEach(row => row.reverse()); else matrix.reverse();
        for (let y = 0; y < matrix.length; ++y)
          for (let x = 0; x < y; ++x) [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        playerRef.current.pos.x = pos; return;
      }
    }
    draw();
  }, [draw]);

  const playerHardDrop = useCallback(() => {
    if (gameOverRef.current || isPausedRef.current) return;
    while (!collide(arenaRef.current, playerRef.current)) playerRef.current.pos.y++;
    playerRef.current.pos.y--;
    merge(arenaRef.current, playerRef.current);
    arenaSweep();
    playerReset();
    draw();
  }, [playerReset, arenaSweep, draw]);

  const gameLoop = useCallback((time = 0) => {
    if (gameOverRef.current || isPausedRef.current) return;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropCounterRef.current += deltaTime;
    if (dropCounterRef.current > dropIntervalRef.current) playerDrop();
    draw();
    rAFRef.current = requestAnimationFrame(gameLoop);
  }, [playerDrop, draw]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      lastTimeRef.current = performance.now();
      rAFRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(rAFRef.current);
  }, [gameOver, isPaused, gameLoop]);

  const startGame = useCallback(() => {
    arenaRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    scoreRef.current = 0;
    setScore(0); setLines(0); setLevel(1);
    gameOverRef.current = false; isPausedRef.current = false;
    setGameOver(false); setIsPaused(false); setGameStarted(true);
    dropIntervalRef.current = 1000;
    playerRef.current.nextQueue = Array.from({ length: NEXT_COUNT }, () => randomPiece());
    playerRef.current.matrix = null;
    playerReset();
  }, [playerReset]);

  const togglePause = useCallback(() => {
    if (gameOverRef.current) return;
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(prev => !prev);
  }, []);

  return {
    score, lines, level, highScore, gameOver, isPaused, gameStarted,
    startGame, togglePause, playerMove, playerRotate, playerDrop, playerHardDrop
  };
}