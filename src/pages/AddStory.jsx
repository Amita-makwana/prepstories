import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

const AddStory = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const err = {};
    if (!form.title?.trim()) err.title = "Title is required";
    if (!form.company?.trim()) err.company = "Company name is required";
    if (!form.role?.trim()) err.role = "Role is required";
    if (!form.content?.trim()) err.content = "Interview process description is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

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

      const res = await api.post("/stories", payload);
      const storyId = res.data.story?._id;
      toast.success("Interview experience posted successfully.");
      navigate(storyId ? `/story/${storyId}` : "/");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to post story. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
          Add Interview Experience
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm md:p-8"
        >
          {/* Basic Information */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Story Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Google SDE Intern 2025"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="company" className={labelClass}>
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="e.g. Google, Amazon"
                    value={form.company}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="role" className={labelClass}>
                    Role / Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="e.g. SDE, ML Intern"
                    value={form.role}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="interviewDate" className={labelClass}>
                    Interview Date
                  </label>
                  <input
                    id="interviewDate"
                    name="interviewDate"
                    type="date"
                    value={form.interviewDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="difficulty" className={labelClass}>
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="result" className={labelClass}>
                    Offer Status
                  </label>
                  <select
                    id="result"
                    name="result"
                    value={form.result}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Waiting</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="rounds" className={labelClass}>
                    Number of Rounds
                  </label>
                  <input
                    id="rounds"
                    name="rounds"
                    type="number"
                    min="1"
                    max="20"
                    value={form.rounds}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Experience Details */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Experience Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="content" className={labelClass}>
                  Interview Process <span className="text-red-500">*</span>
                </label>
                <p className="mb-2 text-xs text-slate-500">
                  Describe the rounds, what happened in each, and key moments.
                </p>
                <textarea
                  id="content"
                  name="content"
                  rows={7}
                  placeholder="Round 1: Online assessment - 2 coding questions. Round 2: Technical interview - DSA..."
                  value={form.content}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                )}
              </div>

              <div>
                <label htmlFor="questionsAsked" className={labelClass}>
                  Questions Asked
                </label>
                <p className="mb-2 text-xs text-slate-500">
                  List or briefly describe the questions you were asked.
                </p>
                <textarea
                  id="questionsAsked"
                  name="questionsAsked"
                  rows={4}
                  placeholder="1. Two Sum variation, 2. Design URL shortener..."
                  value={form.questionsAsked}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="tips" className={labelClass}>
                  Tips for Future Candidates
                </label>
                <textarea
                  id="tips"
                  name="tips"
                  rows={4}
                  placeholder="Practice system design, revise OS and DBMS..."
                  value={form.tips}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="overallExperience" className={labelClass}>
                  Overall Experience
                </label>
                <textarea
                  id="overallExperience"
                  name="overallExperience"
                  rows={3}
                  placeholder="Brief summary of your overall experience..."
                  value={form.overallExperience}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Additional */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Additional
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="tags" className={labelClass}>
                  Tags
                </label>
                <p className="mb-2 text-xs text-slate-500">
                  Comma-separated, e.g. DSA, System Design, HR Round
                </p>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="DSA, System Design, HR Round"
                  value={form.tags}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="rating" className={labelClass}>
                  Optional Rating (1–5)
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">—</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={form.anonymous}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Post Anonymously — Your name will not be shown.
                </span>
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-400 dark:text-slate-950 dark:hover:bg-indigo-300"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Posting...
              </span>
            ) : (
              "Publish Story"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStory;
