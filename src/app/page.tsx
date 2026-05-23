"use client";

import React, { useEffect, useState } from "react";
import GameBoard from "@/components/GameBoard";
import Leaderboard from "@/components/Leaderboard";
import { useGameStore } from "@/store/gameStore";

const SocialLoginButton: React.FC = () => {
  const nestApiBaseUrl =
    process.env.NEXT_PUBLIC_NEST_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://ox-game-backend.onrender.com"
      : "http://localhost:3000");
  const nestLoginUrl = `${nestApiBaseUrl}/api/auth/google`;

  return (
    <a
      href={nestLoginUrl}
      className="
        group relative px-6 py-3
        bg-linear-to-br from-green-500 to-emerald-500
        text-white font-bold rounded-2xl
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        overflow-hidden
        flex items-center justify-center gap-2
      "
    >
      <span className="relative z-10">Login with Google</span>
      <div className="absolute inset-0 bg-linear-to-br from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );
};

const HomePage = () => {
  const setToken = useGameStore((state) => state.setToken);
  const playerToken = useGameStore((state) => state.playerToken);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const resetGame = useGameStore((state) => state.resetGame);

  const [isTokenLoaded, setIsTokenLoaded] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setToken(token);
      localStorage.setItem("jwtToken", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const storedToken = localStorage.getItem("jwtToken");
      if (storedToken) {
        setToken(storedToken);
      }
    }

    setIsTokenLoaded(true);
  }, [setToken]);

  if (!isTokenLoaded) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    resetGame();
    setToken("");
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                OX Game WebApp
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Play OX against AI and compete on the leaderboard.
              </p>
            </div>
            {playerToken ? (
              <button
                onClick={handleLogout}
                className="
                  group relative px-6 py-3
                  bg-linear-to-br from-red-500 to-pink-500
                  text-white font-bold rounded-2xl
                  shadow-lg hover:shadow-xl
                  transition-all duration-300 ease-out
                  hover:scale-105 active:scale-95
                  overflow-hidden
                "
              >
                <span className="relative z-10 flex items-center gap-2">
                  Logout
                </span>
                <div className="absolute inset-0 bg-linear-to-br from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <SocialLoginButton />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-4">
          <GameBoard />
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
                  : "bg-linear-to-br from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 active:scale-95"
              }
            `}
            disabled={gameStatus === "PLAYING" || !playerToken}
          >
            {!playerToken
              ? "Please login first"
              : gameStatus === "PLAYING"
                ? "Game in progress..."
                : "Reset game"}
          </button>
        </div>

        <div className="lg:col-span-1">
          <Leaderboard />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/40 p-6 text-center">
          <p className="text-gray-600 text-sm">
            Built with Next.js and NestJS
          </p>
          <p className="text-gray-400 text-xs mt-2">
            2026 OX Game WebApp
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
