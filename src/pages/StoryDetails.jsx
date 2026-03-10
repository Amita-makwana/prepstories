import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/ui/Loader";
import CommentSection from "../components/comment/CommentSection";
import { Helmet } from "react-helmet-async";
import PageSEO from "../components/seo/PageSEO";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const StoryDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStory = async () => {
    try {
      const res = await api.get(`/stories/${id}`);
      setStory(res.data.story);
    } catch (err) {
      console.error("Failed to load story");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [id]);

  const handleVote = async (voteType) => {
    if (!user) {
      toast.error("Please login to vote.");
      return;
    }

    try {
      const res = await api.post(`/stories/${id}/vote`, { voteType });
      setStory((prev) => ({
        ...prev,
        totalUpvotes: res.data.totalUpvotes ?? 0,
        totalDownvotes: res.data.totalDownvotes ?? 0,
        userVote: res.data.userVote ?? null
      }));
      const msg =
        res.data.userVote === "upvote"
          ? "Upvote added."
          : res.data.userVote === "downvote"
            ? "Downvote added."
            : "Vote removed.";
      toast.success(msg);
    } catch (err) {
      console.error("Vote failed", err);
      const status = err.response?.status;
      if (status === 401) toast.error("Please login to vote.");
      else toast.error(err.response?.data?.message || "Could not update vote.");
    }
  };

  const metaDescription = story?.content
    ? `${String(story.content).slice(0, 155)}${story.content.length > 155 ? "…" : ""}`
    : `${story?.company} ${story?.role} interview experience`;
  const canonicalPath = story?.slug ? `/story/${story.slug}` : `/story/${story?._id}`;

  if (loading) return <Loader />;
  if (!story) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: metaDescription,
    datePublished: story.createdAt,
    dateModified: story.updatedAt || story.createdAt,
    author: story.anonymous
      ? { "@type": "Person", name: "Anonymous" }
      : { "@type": "Person", name: story.author?.name || "Unknown" }
  };

  return (
    <>
      <PageSEO
        title={`${story.title} - ${story.company} Interview Experience`}
        description={metaDescription}
        canonical={canonicalPath}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {story.title}
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          {story.company} — {story.role}
        </p>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Posted by:{" "}
          {story.anonymous ? (
            "Anonymous User"
          ) : story.author?.name ? (
            user && String(story.author._id) === String(user._id) ? (
              <Link to="/profile" className="font-medium text-indigo-500 dark:text-indigo-400 hover:underline">
                {story.author.name}
              </Link>
            ) : (
              story.author.name
            )
          ) : (
            "Unknown"
          )}
        </p>

        <div className="inline-flex items-center">
          <button
            onClick={() => handleVote("upvote")}
            className={`inline-flex items-center gap-1 rounded-l-full border border-r-0 px-3 py-1.5 text-sm font-semibold transition ${
              story.userVote === "upvote"
                ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400 text-white dark:text-slate-950"
                : "border-slate-600 dark:border-slate-600 bg-slate-800/50 text-slate-400 hover:border-indigo-500/50 hover:bg-indigo-500/20 hover:text-indigo-400"
            }`}
          >
            ▲ {story.totalUpvotes ?? 0}
          </button>
          <button
            onClick={() => handleVote("downvote")}
            className={`inline-flex items-center gap-1 rounded-r-full border px-3 py-1.5 text-sm font-semibold transition ${
              story.userVote === "downvote"
                ? "border-rose-500 dark:border-rose-400 bg-rose-500 dark:bg-rose-400 text-white dark:text-slate-950"
                : "border-slate-600 dark:border-slate-600 bg-slate-800/50 text-slate-400 hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-400"
            }`}
          >
            ▼ {story.totalDownvotes ?? 0}
          </button>
        </div>

        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
          {story.content}
        </p>
      </div>

      <CommentSection storyId={story._id} />
    </div>
    </div>
    </>
  );
};

export default StoryDetails;