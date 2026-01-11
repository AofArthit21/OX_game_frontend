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
        setError("ไม่สามารถโหลดข้อมูลกระดานคะแนนได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    const intervalId = setInterval(fetchLeaderboard, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}.`;
  };

  return (
    <div className="bg-linear-to-br from-white via-yellow-50 to-orange-50 p-6 rounded-3xl shadow-2xl border border-yellow-100">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🏆</div>
        <h3 className="text-2xl font-extrabold bg-linear-to-br from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          กระดานคะแนน
        </h3>
        <p className="text-xs text-gray-500 mt-1">ผู้เล่นยอดเยี่ยม</p>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-yellow-600"></div>
          <p className="text-gray-500 mt-3 text-sm">กำลังโหลด...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 rounded-2xl p-4 text-center">
          <p className="text-red-700 text-sm">😞 {error}</p>
        </div>
      )}

      {!isLoading && leaderboard.length === 0 && (
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">👻</div>
          <p className="text-gray-500">ยังไม่มีผู้เล่น</p>
          <p className="text-xs text-gray-400 mt-2">เป็นคนแรกที่ได้คะแนน!</p>
        </div>
      )}

      {!isLoading && leaderboard.length > 0 && (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={index}
              className={`
                relative overflow-hidden
                p-4 rounded-2xl
                transition-all duration-300 ease-out
                hover:scale-102 hover:shadow-lg
                ${
                  index === 0
                    ? "bg-linear-to-br from-yellow-400 to-orange-400 shadow-lg border-2 border-yellow-500"
                    : index === 1
                    ? "bg-linear-to-br from-gray-300 to-gray-400 shadow-md border-2 border-gray-400"
                    : index === 2
                    ? "bg-linear-to-br from-orange-300 to-amber-400 shadow-md border-2 border-orange-400"
                    : "bg-white shadow-sm border border-gray-200"
                }
              `}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`
                    text-2xl font-bold
                    ${index < 3 ? "text-white drop-shadow-md" : "text-gray-500"}
                  `}
                  >
                    {getMedalEmoji(index)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`
                      font-bold truncate
                      ${
                        index < 3
                          ? "text-white text-lg drop-shadow"
                          : "text-gray-800"
                      }
                    `}
                    >
                      {entry.displayName}
                    </p>
                    {entry.consecutiveWins > 0 && (
                      <p
                        className={`
                        text-xs mt-1
                        ${index < 3 ? "text-white/90" : "text-gray-600"}
                      `}
                      >
                        🔥 ชนะติดต่อกัน {entry.consecutiveWins} ครั้ง
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={`
                  px-4 py-2 rounded-xl font-bold text-lg
                  ${
                    index < 3
                      ? "bg-white/30 text-white shadow-md"
                      : "bg-indigo-100 text-indigo-700"
                  }
                `}
                >
                  {entry.totalScore}
                </div>
              </div>

              {index < 3 && (
                <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-gray-600">อัปเดตทุก 5 นาที</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
