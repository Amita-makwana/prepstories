import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/ui/Loader";
import toast from "react-hot-toast";

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

const EditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    role: "",
    interviewDate: "",
    difficulty: "Easy",
    rounds: 1,
    result: "Selected",
    content: "",
    questionsAsked: "",
    tips: "",
    overallExperience: "",
    tags: "",
    rating: "",
    anonymous: false,
  });

  const fetchStory = async () => {
    try {
      const res = await api.get(`/stories/${id}`);
      const s = res.data.story;
      const d = s.interviewDate ? new Date(s.interviewDate).toISOString().slice(0, 10) : "";
      setForm({
        title: s.title || "",
        company: s.company || "",
        role: s.role || "",
        interviewDate: d,
        difficulty: s.difficulty || "Easy",
        rounds: s.rounds || 1,
        result: s.result || "Selected",
        content: s.content || "",
        questionsAsked: s.questionsAsked || "",
        tips: s.tips || "",
        overallExperience: s.overallExperience || "",
        tags: Array.isArray(s.tags) ? s.tags.join(", ") : "",
        rating: s.rating || "",
        anonymous: Boolean(s.anonymous),
      });
    } catch (err) {
      toast.error("Failed to load story.");
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        role: form.role.trim(),
        difficulty: form.difficulty,
        rounds: Number(form.rounds) || 1,
        result: form.result,
        content: form.content.trim(),
        tips: form.tips.trim(),
        overallExperience: form.overallExperience.trim(),
        questionsAsked: form.questionsAsked.trim(),
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        rating: form.rating ? Number(form.rating) : null,
        interviewDate: form.interviewDate || null,
        anonymous: form.anonymous,
      };
      await api.put(`/stories/${id}`, payload);
      toast.success("Story updated successfully.");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
          Edit Story
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm md:p-8"
        >
          <div>
            <label htmlFor="title" className={labelClass}>Title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="company" className={labelClass}>Company</label>
              <input id="company" name="company" value={form.company} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="role" className={labelClass}>Role</label>
              <input id="role" name="role" value={form.role} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="interviewDate" className={labelClass}>Interview Date</label>
              <input id="interviewDate" name="interviewDate" type="date" value={form.interviewDate} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="difficulty" className={labelClass}>Difficulty</label>
              <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className={inputClass}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="result" className={labelClass}>Offer Status</label>
              <select id="result" name="result" value={form.result} onChange={handleChange} className={inputClass}>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Waiting</option>
              </select>
            </div>
            <div>
              <label htmlFor="rounds" className={labelClass}>Rounds</label>
              <input id="rounds" name="rounds" type="number" min="1" max="20" value={form.rounds} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="content" className={labelClass}>Interview Process</label>
            <textarea id="content" name="content" rows={6} value={form.content} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="questionsAsked" className={labelClass}>Questions Asked</label>
            <textarea id="questionsAsked" name="questionsAsked" rows={4} value={form.questionsAsked} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="tips" className={labelClass}>Tips</label>
            <textarea id="tips" name="tips" rows={4} value={form.tips} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="overallExperience" className={labelClass}>Overall Experience</label>
            <textarea id="overallExperience" name="overallExperience" rows={3} value={form.overallExperience} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="tags" className={labelClass}>Tags (comma-separated)</label>
            <input id="tags" name="tags" value={form.tags} onChange={handleChange} className={inputClass} placeholder="DSA, System Design" />
          </div>
          <div>
            <label htmlFor="rating" className={labelClass}>Rating (1–5)</label>
            <select id="rating" name="rating" value={form.rating} onChange={handleChange} className={inputClass}>
              <option value="">—</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" name="anonymous" checked={form.anonymous} onChange={handleChange} className="h-4 w-4 rounded" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Post Anonymously</span>
          </label>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-500 px-6 py-2 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60 dark:bg-indigo-400 dark:text-slate-950"
            >
              {submitting ? "Updating..." : "Update Story"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="rounded-xl bg-slate-200 px-6 py-2 font-medium text-slate-900 dark:bg-slate-700 dark:text-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStory;
