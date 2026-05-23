import React from "react";
import { useGameStore, Cell, GameState } from "@/store/gameStore";
import { api } from "@/lib/api";

const Square: React.FC<{ value: Cell; index: number }> = ({ value, index }) => {
  const {
    gameStatus,
    playerToken,
    board: currentBoard,
    setBoard,
    setGameStatus,
    updateScore,
  } = useGameStore();

  const handleClick = async () => {
    if (!playerToken || value || gameStatus !== "PLAYING") {
      return;
    }

    try {
      const response = await api.post("/move", {
        board: currentBoard,
        playerIndex: index,
      });

      const data = response.data;
      setBoard(data.board);

      let frontendStatus: GameState["gameStatus"];
      if (data.gameStatus === "X") frontendStatus = "WIN";
      else if (data.gameStatus === "O") frontendStatus = "LOSE";
      else if (data.gameStatus === "DRAW") frontendStatus = "DRAW";
      else frontendStatus = "PLAYING";

      setGameStatus(frontendStatus);

      if (data.score !== null) {
        updateScore(data.score, data.consecutiveWins);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error during move:", errorMessage);
    }
  };

  const tokenColor =
    value === "X" ? "text-sky-700" : value === "O" ? "text-rose-700" : "text-transparent";

  return (
    <button
      className={`
        relative flex h-20 w-20 items-center justify-center rounded-2xl border
        border-slate-300 bg-white text-4xl font-bold shadow-[0_4px_14px_rgba(15,23,42,0.08)]
        sm:h-24 sm:w-24 sm:text-5xl
        ${tokenColor}
        ${!value && gameStatus === "PLAYING" ? "hover:border-teal-600 hover:bg-teal-50" : ""}
        disabled:cursor-not-allowed disabled:opacity-70
      `}
      onClick={handleClick}
      disabled={!!value || gameStatus !== "PLAYING"}
    >
      {value}
    </button>
  );
};

const GameBoard: React.FC = () => {
  const board = useGameStore((state) => state.board);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const score = useGameStore((state) => state.score);
  const consecutiveWins = useGameStore((state) => state.consecutiveWins);
  const playerToken = useGameStore((state) => state.playerToken);
  const resetGame = useGameStore((state) => state.resetGame);

  const getStatusMessage = () => {
    if (!playerToken) {
      return {
        text: "Sign in with Google to start playing.",
        style: "text-slate-600 border-slate-300 bg-slate-100",
      };
    }

    switch (gameStatus) {
      case "PLAYING":
        return {
          text: "Your turn",
          style: "text-teal-900 border-teal-300 bg-teal-50",
        };
      case "WIN":
        return {
          text: "Nice one, you won this round",
          style: "text-emerald-900 border-emerald-300 bg-emerald-50",
        };
      case "LOSE":
        return {
          text: "Bot won this round",
          style: "text-rose-900 border-rose-300 bg-rose-50",
        };
      case "DRAW":
        return {
          text: "Draw game",
          style: "text-amber-900 border-amber-300 bg-amber-50",
        };
      default:
        return {
          text: "Ready for a new game",
          style: "text-slate-700 border-slate-300 bg-slate-100",
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <section className="rounded-3xl border border-slate-200 bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_20px_48px_rgba(13,31,45,0.12)] backdrop-blur sm:p-6">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">OX Arena</h2>
          <p className="text-sm text-slate-500">Player vs AI bot</p>
        </div>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Score</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">{score}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Streak</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">{consecutiveWins}</p>
        </div>
      </div>

      <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${statusInfo.style}`}>
        {statusInfo.text}
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, index) => (
            <Square key={index} value={cell} index={index} />
          ))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className={`
          w-full rounded-2xl border px-4 py-3 text-sm font-bold
          ${
            gameStatus === "PLAYING" || !playerToken
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              : "border-teal-700 bg-teal-700 text-white hover:-translate-y-[1px] hover:bg-teal-800"
          }
        `}
        disabled={gameStatus === "PLAYING" || !playerToken}
      >
        {!playerToken ? "Please sign in first" : gameStatus === "PLAYING" ? "Game in progress" : "Start new round"}
      </button>
    </section>
  );
};

export default GameBoard;
