import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import StoryCard from "../components/story/StoryCard";
import Loader from "../components/ui/Loader";
import SearchInput from "../components/ui/SearchInput";
import SortSelect from "../components/ui/SortSelect";
import PageSEO from "../components/seo/PageSEO";
import { SearchX } from "lucide-react";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [stories, setStories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  const fetchStories = async (q) => {
    try {
      setLoading(true);
      const params = q?.trim()
        ? { q: q.trim(), sortBy }
        : { page: 1, limit: 100, sortBy };
      const endpoint = q?.trim() ? "/stories/search" : "/stories";
      const res = await api.get(endpoint, { params });
      setStories(res.data.stories || []);
      setTotal(res.data.total ?? res.data.pagination?.total ?? res.data.stories?.length ?? 0);
    } catch (err) {
      console.error("Failed to fetch stories", err);
      setStories([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery(initialQuery);
    setDebouncedQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    fetchStories(debouncedQuery);
  }, [debouncedQuery, sortBy]);

  useEffect(() => {
    if (debouncedQuery.trim() && stories.length > 0) {
      const unique = [...new Set(
        stories
          .flatMap((s) => [s.company, s.role].filter(Boolean))
          .filter((x) =>
            x.toLowerCase().includes(debouncedQuery.toLowerCase().trim())
          )
          .slice(0, 6)
      )];
      setSuggestions(unique);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, stories]);

  const handleSearchChange = (value) => {
    setDebouncedQuery(value || "");
    const next = value?.trim() ? { search: value.trim() } : {};
    setSearchParams(next, { replace: true });
  };

  const handleSearchSubmit = (value) => {
    const q = (value || searchQuery || "").trim();
    if (q) {
      setSearchParams({ search: q }, { replace: true });
      setSearchQuery(q);
      setDebouncedQuery(q);
    }
  };

  const handleClearSearch = () => {
    setSearchParams({}, { replace: true });
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const resultsCountText = useMemo(() => {
    if (!debouncedQuery.trim()) return null;
    const count = total ?? stories.length;
    return `Showing ${count} result${count === 1 ? "" : "s"} for "${debouncedQuery}"`;
  }, [debouncedQuery, total, stories.length]);

  const pageTitle = debouncedQuery.trim()
    ? `Search: ${debouncedQuery} | PrepStories`
    : "Explore Interview Stories | PrepStories";

  return (
    <>
      <PageSEO title={pageTitle} description="Explore and search real interview experiences by company, role, and topic. Find placement stories from Google, Amazon, Microsoft, and more." canonical="/explore" />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 py-24 transition-colors">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
            Explore Stories
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0 max-w-xl">
            <SearchInput
              value={searchQuery}
              onChange={(v) => {
                setSearchQuery(v);
                setDebouncedQuery(v || "");
                setSearchParams(v?.trim() ? { search: v.trim() } : {}, {
                  replace: true,
                });
              }}
              onSubmit={handleSearchSubmit}
              placeholder="Search company, role, or content (e.g. google sde, amazon interview)"
              debounceMs={350}
              suggestions={suggestions}
              onSuggestionSelect={(s) => {
                setSearchQuery(s);
                setDebouncedQuery(s);
                setSearchParams({ search: s });
              }}
              showClear
            />
            </div>
            <SortSelect value={sortBy} onChange={setSortBy} />
          </div>

          {resultsCountText && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {resultsCountText}
            </p>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        )}

        {!loading && stories.length === 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-20 text-center">
            <SearchX
              size={56}
              className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
            />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              No stories found
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {debouncedQuery.trim()
                ? `No results for "${debouncedQuery}". Try different keywords like company name, role, or topic.`
                : "Start typing to search stories by company, role, or content."}
            </p>
            {debouncedQuery.trim() && (
              <button
                onClick={handleClearSearch}
                className="mt-4 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!loading && stories.length > 0 && (
          <div className="space-y-6">
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                onVote={(id, data) => {
                  setStories((prev) =>
                    prev.map((s) =>
                      s._id === id
                        ? { ...s, totalUpvotes: data.totalUpvotes, totalDownvotes: data.totalDownvotes, userVote: data.userVote }
                        : s
                    )
                  );
                }}
                highlightQuery={debouncedQuery.trim() || undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Explore;
