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
      console.error("Game not ready or invalid move.");
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

  return (
    <button
      className={`
        relative w-24 h-24 text-5xl font-bold 
        bg-linear-to-br from-white to-gray-50
        border-2 border-gray-200
        rounded-xl shadow-md
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:shadow-xl hover:scale-105 hover:border-indigo-300
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${
          value === "X"
            ? "text-blue-500"
            : value === "O"
            ? "text-rose-500"
            : "text-transparent"
        }
        ${
          !value && gameStatus === "PLAYING"
            ? "hover:bg-linear-to-br hover:from-indigo-50 hover:to-purple-50"
            : ""
        }
      `}
      onClick={handleClick}
      disabled={!!value || gameStatus !== "PLAYING"}
    >
      <span className="drop-shadow-md">{value}</span>
      {!value && gameStatus === "PLAYING" && (
        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-transparent to-indigo-100 opacity-0 hover:opacity-30 transition-opacity duration-300" />
      )}
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
        text: "กรุณาเข้าสู่ระบบก่อนเล่น",
        emoji: "🔒",
        color: "text-gray-600",
      };
    }

    switch (gameStatus) {
      case "PLAYING":
        return { text: "ตาของคุณ!", emoji: "🎮", color: "text-indigo-600" };
      case "WIN":
        return {
          text: "ยินดีด้วย! คุณชนะ!",
          emoji: "🎉",
          color: "text-green-600",
        };
      case "LOSE":
        return { text: "คุณแพ้บอท", emoji: "😢", color: "text-red-600" };
      case "DRAW":
        return { text: "เสมอ!", emoji: "🤝", color: "text-yellow-600" };
      default:
        return {
          text: "พร้อมเล่นหรือยัง?",
          emoji: "👾",
          color: "text-gray-600",
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="p-8 max-w-lg mx-auto bg-linear-to-br from-white via-indigo-50 to-purple-50 shadow-2xl rounded-3xl border border-indigo-100">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          OX Game
        </h2>
        <p className="text-sm text-gray-500 font-medium">Player vs AI Bot</p>
      </div>

      <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md">
            <p className="text-xs text-indigo-100 font-semibold mb-1">
              คะแนนรวม
            </p>
            <p className="text-3xl font-bold text-white">{score}</p>
          </div>
          <div className="text-center p-3 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl shadow-md">
            <p className="text-xs text-green-100 font-semibold mb-1">
              ชนะติดต่อกัน
            </p>
            <p className="text-3xl font-bold text-white">{consecutiveWins}</p>
          </div>
        </div>
      </div>

      <div
        className={`mb-6 text-center py-4 px-6 rounded-2xl bg-white shadow-lg border-2 ${
          !playerToken
            ? "border-gray-300"
            : gameStatus === "WIN"
            ? "border-green-300"
            : gameStatus === "LOSE"
            ? "border-red-300"
            : gameStatus === "DRAW"
            ? "border-yellow-300"
            : "border-indigo-300"
        }`}
      >
        <div className="text-4xl mb-2">{statusInfo.emoji}</div>
        <p className={`text-xl font-bold ${statusInfo.color}`}>
          {statusInfo.text}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
        {board.map((cell, index) => (
          <Square key={index} value={cell} index={index} />
        ))}
      </div>

      <button
        onClick={resetGame}
        className={`
          w-full py-4 px-6 
          font-bold text-lg rounded-2xl
          shadow-lg
          transition-all duration-300 ease-out
          ${
            gameStatus === "PLAYING" || !playerToken
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-linear-to-br from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95"
          }
        `}
        disabled={gameStatus === "PLAYING" || !playerToken}
      >
        {!playerToken
          ? "🔒 กรุณาเข้าสู่ระบบก่อน"
          : gameStatus === "PLAYING"
          ? "กำลังเล่นอยู่..."
          : "🎮 เริ่มเกมใหม่"}
      </button>

      <div className="mt-6 text-center">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            playerToken
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          <span>{playerToken ? "✅" : "🚫"}</span>
          <span>{playerToken ? "เข้าสู่ระบบแล้ว" : "กรุณาเข้าสู่ระบบ"}</span>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
