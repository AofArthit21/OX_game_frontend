// /frontend/store/gameStore.ts

import { create } from "zustand";

// กำหนด Types/Interfaces ที่จำเป็น
export type Player = "X" | "O" | null;
export type Cell = Player; // แต่ละช่องสามารถเป็น 'X', 'O', หรือ null
export type Board = Cell[]; // กระดาน 9 ช่อง (0-8)

export interface GameState {
  board: Board;
  currentPlayer: "X" | "O";
  gameStatus: "PLAYING" | "WIN" | "LOSE" | "DRAW" | "NOT_STARTED";
  playerToken: string | null; // JWT token สำหรับเรียก API
  score: number; // คะแนนปัจจุบันของผู้เล่น
  consecutiveWins: number; // นับจำนวนครั้งที่ชนะติดต่อกัน

  // Actions
  setBoard: (board: Board) => void;
  makeMove: (index: number, move: Player) => void;
  resetGame: () => void;
  setGameStatus: (status: GameState["gameStatus"]) => void;
  setToken: (token: string) => void;
  updateScore: (newScore: number, consecutive: number) => void;
}

// สร้าง Store ด้วย create()
export const useGameStore = create<GameState>((set) => ({
  // Initial State
  board: Array(9).fill(null), // [null, null, ..., null]
  currentPlayer: "X",
  gameStatus: "NOT_STARTED",
  playerToken: null,
  score: 0,
  consecutiveWins: 0,

  // Actions/Setters
  setBoard: (board) => set({ board }),

  makeMove: (index, move) =>
    set((state) => {
      // ตรวจสอบความถูกต้องเบื้องต้น (การตรวจสอบหลักจะอยู่ที่ Backend)
      if (state.board[index] !== null || state.gameStatus !== "PLAYING") {
        return state; // ไม่เปลี่ยนแปลงสถานะถ้าช่องถูกเติมแล้ว
      }

      const newBoard = [...state.board];
      newBoard[index] = move;

      // การเปลี่ยนตาผู้เล่น (ถ้าเป็น X ให้เปลี่ยนเป็น O, ถ้าเป็น O ให้เปลี่ยนเป็น X)
      const nextPlayer = state.currentPlayer === "X" ? "O" : "X";

      return {
        board: newBoard,
        currentPlayer: nextPlayer, // อาจจะไม่ใช้ในโหมด P vs Bot
      };
    }),

  resetGame: () =>
    set({
      board: Array(9).fill(null),
      gameStatus: "PLAYING",
      currentPlayer: "X", // เริ่มจากผู้เล่น 'X' เสมอ
    }),

  setGameStatus: (status) => set({ gameStatus: status }),
  setToken: (token) => set({ playerToken: token }),
  updateScore: (newScore, consecutive) =>
    set({
      score: newScore,
      consecutiveWins: consecutive,
    }),
}));
