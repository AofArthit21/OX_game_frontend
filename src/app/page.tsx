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
      className="inline-flex items-center justify-center rounded-2xl border border-teal-700 bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(15,118,110,0.35)] hover:-translate-y-[1px] hover:bg-teal-800"
    >
      Sign in with Google
    </a>
  );
};

const HomePage = () => {
  const setToken = useGameStore((state) => state.setToken);
  const playerToken = useGameStore((state) => state.playerToken);
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

  const handleLogout = () => {
    resetGame();
    setToken("");
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };

  if (!isTokenLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          Loading game session...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-200 bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_20px_48px_rgba(13,31,45,0.12)] backdrop-blur sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Browser Game</p>
              <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">OX Game</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                A clean tic-tac-toe arena with live score tracking and leaderboard ranking.
              </p>
            </div>
            {playerToken ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-2xl border border-rose-700 bg-rose-700 px-5 py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(190,18,60,0.28)] hover:-translate-y-[1px] hover:bg-rose-800"
              >
                Sign out
              </button>
            ) : (
              <SocialLoginButton />
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GameBoard />
          </div>
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </section>

        <footer className="rounded-2xl border border-slate-200 bg-[rgba(255,255,255,0.72)] px-4 py-3 text-center text-xs text-slate-500">
          Built with Next.js + NestJS
        </footer>
      </div>
    </main>
  );
};

export default HomePage;
