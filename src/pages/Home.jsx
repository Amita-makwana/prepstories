

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { getAuthBaseUrl } from "../services/api";
import StoryCard from "../components/story/StoryCard";
import { SearchX } from "lucide-react";
import Loader from "../components/ui/Loader";
import SortSelect from "../components/ui/SortSelect";
import TrendingCompanies from "../components/home/TrendingCompanies";
import PageSEO from "../components/seo/PageSEO";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/stories", {
        params: { page: 1, limit: 20, sortBy: sortBy || "latest" }
      });
      const list = res.data?.stories ?? res.data ?? [];
      setStories(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load stories", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [sortBy]);

  const filteredStories = stories.filter((story) =>
    `${story.title} ${story.company} ${story.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <PageSEO title="PrepStories | Placement Preparation Stories" description="Discover authentic interview stories shared by real candidates. Prepare smarter with placement experiences from Google, Amazon, Microsoft, and more." canonical="/" />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-[-220px] left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-24 pb-20 md:grid-cols-2">
        {/* Left Side */}
        <div className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            Built for real interview prep
          </p>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-5xl lg:text-6xl">
            Real Interview Experiences
          </h1>

          <p className="max-w-xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
            Discover authentic interview stories shared by real candidates and
            prepare smarter.
          </p>

          {/* Hero Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!search.trim()) return;
              navigate(`/explore?search=${encodeURIComponent(search.trim())}`);
            }}
            className="flex flex-col gap-3 md:flex-row"
          >
            <input
              type="text"
              placeholder="Search by company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 md:w-40"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/explore")}
              className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-400"
            >
              Explore Stories
            </button>

            <button
              onClick={() => {
                if (user) navigate("/add");
                else
                  window.location.href = `${getAuthBaseUrl()}/api/auth/google`;
              }}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-100 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-900/60"
            >
              Share Experience
            </button>
          </div>
        </div>

        {/* Floating Preview Cards */}
        {/* <div className="relative hidden space-y-5 md:block">
          <Link
            to="/company/Google"
            className="block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-lg shadow-black/10 dark:shadow-black/40 transition hover:scale-[1.02] hover:border-indigo-500/50"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">Google · SDE Intern</p>
            <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
              “System design round was tougher than any DSA question.”
            </p>
          </Link>

          <Link
            to="/company/Amazon"
            className="block translate-x-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/40 transition hover:scale-[1.02] hover:border-indigo-500/50"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">Amazon · SDE 1</p>
            <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
              “Most of my time went into behavioral deep dives.”
            </p>
          </Link>

          <Link
            to="/explore"
            className="block -translate-x-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/40 transition hover:scale-[1.02] hover:border-indigo-500/50"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">Early-stage startup · Backend</p>
            <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
              “Live coding + edge cases on real production incidents.”
            </p>
          </Link>
        </div> */
        
        <div className="relative hidden space-y-5 md:block">

  <Link
    to="/company/Google"
    className="block rounded-2xl border border-slate-200 dark:border-slate-800 
    bg-white dark:bg-slate-900/80 p-5 shadow-lg shadow-black/10 
    dark:shadow-black/40 transition hover:scale-[1.02] hover:border-indigo-500/50"
  >
    <p className="text-xs text-slate-500 dark:text-slate-400">
      Google · SDE Intern
    </p>
    <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
      “System design round was tougher than any DSA question.”
    </p>
  </Link>


  <Link
    to="/company/Amazon"
    className="block translate-x-8 rounded-2xl border border-slate-200 
    dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-lg 
    shadow-black/10 dark:shadow-black/40 transition hover:scale-[1.02] 
    hover:border-indigo-500/50"
  >
    <p className="text-xs text-slate-500 dark:text-slate-400">
      Amazon · SDE 1
    </p>
    <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
      “Most of my time went into behavioral deep dives.”
    </p>
  </Link>


  <Link
    to="/explore"
    className="block -translate-x-6 rounded-2xl border border-slate-200 
    dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-lg 
    shadow-black/10 dark:shadow-black/40 transition hover:scale-[1.02] 
    hover:border-indigo-500/50"
  >
    <p className="text-xs text-slate-500 dark:text-slate-400">
      Early-stage startup · Backend
    </p>
    <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
      “Live coding + edge cases on real production incidents.”
    </p>
  </Link>

</div>
        }
        
      </section>

      {/* FEATURED SECTION */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/90 px-6 py-12 md:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 md:text-3xl">
              Fresh interview experiences
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Recently shared stories from candidates across companies and roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <SortSelect value={sortBy} onChange={setSortBy} />
            <input
            type="text"
            placeholder="Filter by company, role, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-6xl">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader />
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="py-20 text-center text-slate-500 dark:text-slate-400">
              <SearchX size={48} className="mx-auto mb-4 opacity-60" />
              <p>
                {search.trim()
                  ? "No stories match your search yet."
                  : "No interview experiences yet. Be the first to share one!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredStories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRENDING COMPANIES */}
      <TrendingCompanies />

      {/* VALUE SECTION */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-14 text-center">
        <div className="mx-auto max-w-3xl space-y-5">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 md:text-3xl">
            Prepare with signal, not noise.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 md:text-base">
            PrepStories is built for ambitious candidates who want real, specific
            interview stories instead of generic advice. Every post comes from
            someone who actually sat in the hot seat.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="mt-2 rounded-xl bg-indigo-500 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-400"
          >
            Start exploring stories
          </button>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;