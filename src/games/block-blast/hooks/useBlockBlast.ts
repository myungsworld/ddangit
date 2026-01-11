import { useState, useCallback, useEffect } from 'react';
import { GameState, GamePhase, Cell, BlockShape, PreviewPosition } from '../types';
import { GRID_SIZE, SCORE_CONFIG, getRandomBlock, getBlockSize } from '../constants';

// 빈 그리드 생성
function createEmptyGrid(): Cell[][] {
  return Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({ filled: false, color: null }))
  );
}

// 새 블록 3개 생성
function generateNewBlocks(): (BlockShape | null)[] {
  return [getRandomBlock(), getRandomBlock(), getRandomBlock()];
}

// 로컬 스토리지에서 최고 점수 가져오기
function getStoredHighScore(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem('block-blast-highscore');
  return stored ? parseInt(stored, 10) : 0;
}

// 최고 점수 저장
function saveHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('block-blast-highscore', score.toString());
}

// 초기 상태
function getInitialState(): GameState {
  return {
    phase: 'ready',
    grid: createEmptyGrid(),
    currentBlocks: [null, null, null],
    score: 0,
    highScore: getStoredHighScore(),
    combo: 0,
    dragging: null,
    preview: null,
  };
}

export function useBlockBlast() {
  const [state, setState] = useState<GameState>(getInitialState);

  // 클라이언트 측에서 하이스코어 로드
  useEffect(() => {
    setState(prev => ({
      ...prev,
      highScore: getStoredHighScore(),
    }));
  }, []);

  // 블록을 특정 위치에 배치할 수 있는지 확인
  const canPlaceBlock = useCallback((grid: Cell[][], shape: boolean[][], row: number, col: number): boolean => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const gridRow = row + r;
          const gridCol = col + c;

          // 그리드 범위 체크
          if (gridRow < 0 || gridRow >= GRID_SIZE || gridCol < 0 || gridCol >= GRID_SIZE) {
            return false;
          }

          // 이미 채워진 셀 체크
          if (grid[gridRow][gridCol].filled) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  // 블록을 어디에도 배치할 수 없는지 확인
  const hasNoValidMoves = useCallback((grid: Cell[][], blocks: (BlockShape | null)[]): boolean => {
    for (const block of blocks) {
      if (!block) continue;

      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (canPlaceBlock(grid, block.shape, row, col)) {
            return false;
          }
        }
      }
    }
    return true;
  }, [canPlaceBlock]);

  // 완성된 줄 체크 및 제거
  const clearLines = useCallback((grid: Cell[][]): { newGrid: Cell[][], linesCleared: number } => {
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    // 완성된 행 찾기
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r].every(cell => cell.filled)) {
        rowsToClear.push(r);
      }
    }

    // 완성된 열 찾기
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid.every(row => row[c].filled)) {
        colsToClear.push(c);
      }
    }

    const linesCleared = rowsToClear.length + colsToClear.length;

    if (linesCleared === 0) {
      return { newGrid: grid, linesCleared: 0 };
    }

    // 새 그리드 생성 (줄 제거)
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => {
        if (rowsToClear.includes(r) || colsToClear.includes(c)) {
          return { filled: false, color: null };
        }
        return cell;
      })
    );

    return { newGrid, linesCleared };
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    setState({
      phase: 'playing',
      grid: createEmptyGrid(),
      currentBlocks: generateNewBlocks(),
      score: 0,
      highScore: getStoredHighScore(),
      combo: 0,
      dragging: null,
      preview: null,
    });
  }, []);

  // 게임 리셋
  const resetGame = useCallback(() => {
    setState(getInitialState());
  }, []);

  // 드래그 시작
  const startDrag = useCallback((shapeIndex: number, offsetX: number, offsetY: number) => {
    setState(prev => {
      const block = prev.currentBlocks[shapeIndex];
      if (!block) return prev;

      return {
        ...prev,
        dragging: {
          shapeIndex,
          shape: block,
          offsetX,
          offsetY,
        },
      };
    });
  }, []);

  // 드래그 업데이트 (미리보기 위치 계산)
  const updatePreview = useCallback((row: number, col: number) => {
    setState(prev => {
      if (!prev.dragging) return prev;

      const valid = canPlaceBlock(prev.grid, prev.dragging.shape.shape, row, col);

      return {
        ...prev,
        preview: { row, col, valid },
      };
    });
  }, [canPlaceBlock]);

  // 드래그 종료
  const endDrag = useCallback(() => {
    setState(prev => ({
      ...prev,
      dragging: null,
      preview: null,
    }));
  }, []);

  // 블록 배치
  const placeBlock = useCallback((row: number, col: number): boolean => {
    let placed = false;

    setState(prev => {
      if (!prev.dragging || prev.phase !== 'playing') return prev;

      const { shape, shapeIndex } = prev.dragging;

      // 배치 가능한지 확인
      if (!canPlaceBlock(prev.grid, shape.shape, row, col)) {
        return {
          ...prev,
          dragging: null,
          preview: null,
        };
      }

      // 블록 배치
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c })));
      for (let r = 0; r < shape.shape.length; r++) {
        for (let c = 0; c < shape.shape[r].length; c++) {
          if (shape.shape[r][c]) {
            newGrid[row + r][col + c] = { filled: true, color: shape.color };
          }
        }
      }

      // 줄 클리어
      const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid);

      // 점수 계산
      const blockScore = getBlockSize(shape.shape) * SCORE_CONFIG.blockPlace;
      const lineScore = linesCleared * SCORE_CONFIG.lineClear;
      const newCombo = linesCleared > 0 ? prev.combo + 1 : 0;
      const comboScore = newCombo > 1 ? (newCombo - 1) * SCORE_CONFIG.comboMultiplier : 0;
      const totalScore = blockScore + lineScore + comboScore;
      const newScore = prev.score + totalScore;

      // 새 블록 배열 업데이트
      const newBlocks = [...prev.currentBlocks];
      newBlocks[shapeIndex] = null;

      // 모든 블록이 사용되면 새로 생성
      const allUsed = newBlocks.every(b => b === null);
      const finalBlocks = allUsed ? generateNewBlocks() : newBlocks;

      // 게임 오버 체크 - ending 페이즈로 전환 (애니메이션용)
      const gameOver = hasNoValidMoves(clearedGrid, finalBlocks);

      // 최고 점수 업데이트
      let highScore = prev.highScore;
      if (newScore > highScore) {
        highScore = newScore;
        saveHighScore(highScore);
      }

      placed = true;

      return {
        ...prev,
        grid: clearedGrid,
        currentBlocks: finalBlocks,
        score: newScore,
        highScore,
        combo: newCombo,
        phase: gameOver ? 'ending' : 'playing',
        dragging: null,
        preview: null,
      };
    });

    return placed;
  }, [canPlaceBlock, clearLines, hasNoValidMoves]);

  // ending -> gameover 전환 (애니메이션 후)
  const finishGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'gameover',
    }));
  }, []);

  return {
    // 상태
    phase: state.phase,
    grid: state.grid,
    currentBlocks: state.currentBlocks,
    score: state.score,
    highScore: state.highScore,
    combo: state.combo,
    dragging: state.dragging,
    preview: state.preview,

    // 액션
    startGame,
    resetGame,
    startDrag,
    updatePreview,
    endDrag,
    placeBlock,
    finishGame,
    canPlaceBlock: (shape: boolean[][], row: number, col: number) =>
      canPlaceBlock(state.grid, shape, row, col),

    // 게임 데이터 (결과 화면용)
    gameData: {
      score: state.score,
      highScore: state.highScore,
    },
  };
}
