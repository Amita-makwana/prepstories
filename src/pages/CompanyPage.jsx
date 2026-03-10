import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import StoryCard from "../components/story/StoryCard";
import Loader from "../components/ui/Loader";
import SortSelect from "../components/ui/SortSelect";
import PageSEO from "../components/seo/PageSEO";

const difficultyColors = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

const CompanyPage = () => {
  const { companyName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get("role") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const sortBy = searchParams.get("sort") || "latest";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyName) return;
      setLoading(true);
      try {
        const params = { sortBy };
        if (role) params.role = role;
        if (difficulty) params.difficulty = difficulty;
        const res = await api.get(
          `/stories/company/${encodeURIComponent(companyName)}`,
          { params }
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch company data", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyName, role, difficulty, sortBy]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  if (loading && !data) return <Loader />;
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Company not found.</p>
      </div>
    );
  }

  const { company, stories, total, difficultyPercent, topQuestions } = data;
  const displayName = company || decodeURIComponent(companyName || "");

  return (
    <>
      <PageSEO
        title={`${displayName} Interview Experiences`}
        description={`Read real ${displayName} interview experiences and preparation stories. ${total} interview experience${total !== 1 ? "s" : ""} shared by candidates.`}
        canonical={`/company/${encodeURIComponent(companyName || "")}`}
      />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl text-slate-900 dark:text-slate-50">
            {displayName}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {total} interview experience{total !== 1 ? "s" : ""}
          </p>
        </header>

        {/* Filters & Sort */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <SortSelect
            value={sortBy}
            onChange={(v) => updateFilter("sort", v)}
          />
          <select
            value={difficulty}
            onChange={(e) => updateFilter("difficulty", e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="">All difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <input
            type="text"
            placeholder="Filter by role..."
            value={role}
            onChange={(e) => updateFilter("role", e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 w-40"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,280px]">
          <div>
            {/* Difficulty Analytics */}
            <section className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
                Interview Difficulty for {displayName}
              </h2>
              <div className="space-y-3">
                {["Easy", "Medium", "Hard"].map((d) => (
                  <div key={d} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-slate-600 dark:text-slate-400">
                      {d}:
                    </span>
                    <div className="flex-1 h-6 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className={`h-full ${difficultyColors[d]} transition-all`}
                        style={{
                          width: `${difficultyPercent[d] ?? 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-12">
                      {difficultyPercent[d] ?? 0}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Stories List */}
            <section>
              {loading ? (
                <Loader />
              ) : stories.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-16 text-center text-slate-500 dark:text-slate-400">
                  No interview experiences found for this company.
                </div>
              ) : (
                <div className="space-y-6">
                  {stories.map((story) => (
                    <StoryCard key={story._id} story={story} onVote={() => {}} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Top Questions Sidebar */}
          <aside className="lg:order-first lg:order-none">
            <section className="sticky top-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
                Top Interview Questions
              </h2>
              {topQuestions && topQuestions.length > 0 ? (
                <ul className="space-y-2">
                  {topQuestions.slice(0, 10).map((q, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-indigo-500 dark:text-indigo-400">
                        •
                      </span>
                      <span>{q.text}</span>
                      {q.count > 1 && (
                        <span className="shrink-0 text-slate-400 dark:text-slate-500">
                          ({q.count})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No questions extracted yet. Share your experience to help others!
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
    </>
  );
};

export default CompanyPage;
