import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface LeaderboardEntry {
  displayName: string;
  totalScore: number;
  consecutiveWins: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("/leaderboard");
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Could not load leaderboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    const intervalId = setInterval(fetchLeaderboard, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const getRankLabel = (index: number) => {
    if (index === 0) return "1st";
    if (index === 1) return "2nd";
    if (index === 2) return "3rd";
    return `${index + 1}th`;
  };

  return (
    <aside className="rounded-3xl border border-slate-200 bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_20px_48px_rgba(13,31,45,0.12)] backdrop-blur sm:p-6">
      <header className="mb-5 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Season Ranking</p>
        <h3 className="mt-2 text-2xl font-extrabold text-slate-900">Leaderboard</h3>
      </header>

      {isLoading && (
        <div className="space-y-3">
          <div className="h-14 animate-pulse rounded-2xl bg-slate-100"></div>
          <div className="h-14 animate-pulse rounded-2xl bg-slate-100"></div>
          <div className="h-14 animate-pulse rounded-2xl bg-slate-100"></div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {error}
        </div>
      )}

      {!isLoading && !error && leaderboard.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No players yet.
        </div>
      )}

      {!isLoading && !error && leaderboard.length > 0 && (
        <div className="space-y-2.5">
          {leaderboard.map((entry, index) => {
            const isTop = index < 3;
            return (
              <div
                key={`${entry.displayName}-${index}`}
                className={`flex items-center justify-between rounded-2xl border px-3 py-3 ${
                  isTop ? "border-teal-200 bg-teal-50/70" : "border-slate-200 bg-white"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isTop ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {getRankLabel(index)}
                    </span>
                    <p className="truncate text-sm font-bold text-slate-900">{entry.displayName}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Streak: {entry.consecutiveWins}</p>
                </div>
                <div className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm font-extrabold text-white">
                  {entry.totalScore}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-5 text-center text-xs text-slate-500">Auto-refresh every 60 seconds</p>
    </aside>
  );
};

export default Leaderboard;
