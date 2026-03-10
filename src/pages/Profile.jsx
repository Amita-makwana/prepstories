import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";
import StoryCard from "../components/story/StoryCard";
import PageSEO from "../components/seo/PageSEO";

const Profile = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyStories = async () => {
    try {
      const res = await api.get("/stories/me/mystories");
      setStories(res.data.stories || []);
    } catch (error) {
      console.error("Failed to fetch stories", error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/stories/${id}`);
      toast.success("Story deleted.");
      fetchMyStories();
    } catch {
      toast.error("Failed to delete story.");
    }
  };

  const stats = useMemo(() => {
    const totalPosts = stories?.length || 0;
    const totalUpvotes =
      stories?.reduce((sum, s) => sum + (s.upvoteCount || 0), 0) || 0;
    let joined = null;
    if (user?.createdAt) {
      const d = new Date(user.createdAt);
      joined = d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      });
    }
    return { totalPosts, totalUpvotes, joined };
  }, [stories, user?.createdAt]);

  if (loading) return <Loader />;

  if (!user) return null;

  return (
    <>
      <PageSEO title={`${user?.name || "Profile"} | PrepStories`} description="View your PrepStories profile and interview experiences." canonical="/profile" noindex />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {/* Profile Header */}
        <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <img
              src={user.avatar}
              alt={`${user.name} profile avatar`}
              loading="lazy"
              className="h-16 w-16 rounded-full border border-slate-200 dark:border-slate-700 md:h-20 md:w-20"
            />

            <div>
              <h1 className="text-xl font-semibold md:text-2xl">
                {user.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              {stats.joined && (
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Joined <span className="font-medium">{stats.joined}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:w-80">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3 py-2 text-center">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Posts
              </p>
              <p className="mt-1 text-lg font-semibold text-indigo-500 dark:text-indigo-400">
                {stats.totalPosts}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3 py-2 text-center">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Total upvotes
              </p>
              <p className="mt-1 text-lg font-semibold text-indigo-500 dark:text-indigo-400">
                {stats.totalUpvotes}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3 py-2 text-center">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Comments
              </p>
              <p className="mt-1 text-lg font-semibold text-indigo-500 dark:text-indigo-400">
                {/* we don't have per-user comment stats yet, show placeholder */}
                —
              </p>
            </div>
          </div>
        </section>

        {/* Stories List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 md:text-xl">
              Your stories
            </h2>
            <Link
              to="/add"
              className="rounded-xl bg-indigo-500 dark:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-300"
            >
              Write new story
            </Link>
          </div>

          {stories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 py-10 text-center text-slate-500 dark:text-slate-400">
              You haven&apos;t posted any stories yet.
            </div>
          ) : (
            <div className="space-y-5">
              {stories.map((story) => (
                <div key={story._id} className="space-y-2">
                  <StoryCard story={story} onVote={() => {}} />
                  <div className="flex justify-end gap-3 text-sm">
                    <Link
                      to={`/edit/${story._id}`}
                      className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1 text-indigo-500 dark:text-indigo-400 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-900/80"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(story._id)}
                      className="rounded-lg border border-red-500/40 px-3 py-1 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
};

export default Profile;