import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/ui/Loader";
import PageSEO from "../components/seo/PageSEO";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/users/leaderboard", {
          params: { limit: 20 },
        });
        setLeaderboard(res.data.leaderboard || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <>
      <PageSEO title="Top Contributors Leaderboard" description="See top PrepStories contributors. Earn points by posting interview experiences, receiving upvotes, and commenting." canonical="/leaderboard" />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold md:text-4xl text-slate-900 dark:text-slate-50">
            🏆 Top Contributors
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Earn points by posting experiences, receiving upvotes, and commenting.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-16 text-center text-slate-500 dark:text-slate-400">
            No contributors yet. Be the first to share your interview experience!
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                    user.rank === 1
                      ? "bg-amber-400 text-amber-950"
                      : user.rank === 2
                        ? "bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100"
                        : user.rank === 3
                          ? "bg-amber-700 text-amber-100"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {user.rank}
                </span>
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={`${user.name} profile avatar`}
                    loading="lazy"
                    className="h-12 w-12 rounded-full border border-slate-200 dark:border-slate-700"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {user.reputationPoints} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Leaderboard;
