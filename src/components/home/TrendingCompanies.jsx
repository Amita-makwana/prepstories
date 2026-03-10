import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../ui/Loader";

const TrendingCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get("/stories/trending-companies", {
          params: { limit: 8 },
        });
        setCompanies(res.data.companies || []);
      } catch (err) {
        console.error("Failed to fetch trending companies", err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (companies.length === 0) return null;

  return (
    <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          🔥 Trending Companies
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((c) => (
            <Link
              key={c.company}
              to={`/company/${encodeURIComponent(c.company)}`}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm transition hover:border-indigo-500/50 hover:shadow-md dark:hover:border-indigo-500/50"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {c.company}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {c.storyCount} experience{c.storyCount !== 1 ? "s" : ""} • {c.totalUpvotes} upvotes
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCompanies;
