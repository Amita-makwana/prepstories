import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { highlightMatch } from "../../utils/highlightText";

const StoryCard = ({ story, onUpvote, highlightQuery }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [localUpvotes, setLocalUpvotes] = useState(null);
  const [localHasUpvoted, setLocalHasUpvoted] = useState(
    Boolean(story.hasUpvoted)
  );

  const upvoteCount = useMemo(() => {
    if (localUpvotes !== null) return localUpvotes;
    return story.upvoteCount || 0;
  }, [localUpvotes, story.upvoteCount]);

  const commentCount = story.commentCount ?? 0;

  const postedOn = useMemo(() => {
    if (!story.createdAt) return null;
    const d = new Date(story.createdAt);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }, [story.createdAt]);

  const handleUpvote = async (e) => {
    e.stopPropagation();
    console.log("Upvote clicked for story:", story._id);
    console.log("User:", user);

    if (!user) {
      console.log("No user, redirecting to auth");
      window.location.href = `${import.meta.env.VITE_API_URL.replace(
        "/api",
        ""
      )}/api/auth/google`;
      return;
    }

    try {
      console.log("Making API call to:", `/stories/${story._id}/upvote`);
      const res = await api.post(`/stories/${story._id}/upvote`);
      console.log("API response:", res.data);
      const next = res.data.upvoteCount ?? res.data.upvotes ?? upvoteCount;
      console.log("Next upvote count:", next);
      setLocalUpvotes(next);
      if (typeof res.data.hasUpvoted === "boolean") {
        setLocalHasUpvoted(res.data.hasUpvoted);
      } else {
        setLocalHasUpvoted((prev) => !prev);
      }
      onUpvote?.(story._id, next);
      toast.success(res.data.hasUpvoted ? "Upvote added." : "Upvote removed.");
    } catch (err) {
      console.error("Upvote failed", err);
      toast.error("Could not update upvote.");
    }
  };

  const handleOpen = () => {
    navigate(`/story/${story._id}`);
  };

  return (
    <article
      onClick={handleOpen}
      className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-indigo-500/10 transition cursor-pointer flex flex-col gap-4"
    >
      <header className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {highlightQuery ? highlightMatch(story.title || "", highlightQuery) : story.title}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {highlightQuery
              ? <>{highlightMatch(story.company || "", highlightQuery)} — {highlightMatch(story.role || "", highlightQuery)}</>
              : `${story.company} — ${story.role}`
            }
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Posted by:{" "}
            {story.anonymous ? (
              "Anonymous User"
            ) : story.author?.name ? (
              user && String(story.author._id) === String(user._id) ? (
                <Link to="/profile" onClick={(e) => e.stopPropagation()} className="font-medium text-indigo-500 dark:text-indigo-400 hover:underline">
                  {story.author.name}
                </Link>
              ) : (
                story.author.name
              )
            ) : (
              "Unknown"
            )}
          </p>

          {postedOn && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Posted on <span className="font-medium">{postedOn}</span>
            </p>
          )}
        </div>

        <button
          onClick={handleUpvote}
          className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
            localHasUpvoted
              ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400 text-white dark:text-slate-950 shadow-sm shadow-indigo-500/40"
              : "border-indigo-500/40 dark:border-indigo-400/40 bg-indigo-500/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
          }`}
        >
          ▲ {upvoteCount}
        </button>
      </header>

      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
        {highlightQuery ? highlightMatch(String(story.content || "").slice(0, 200), highlightQuery) : story.content}
      </p>

      <footer className="mt-auto flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
          {commentCount} comment{commentCount === 1 ? "" : "s"}
        </span>

        <Link
          to={`/story/${story._id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-medium"
        >
          Read full story →
        </Link>
      </footer>
    </article>
  );
};

export default StoryCard;