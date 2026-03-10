const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "company", label: "Company" },
  { value: "role", label: "Role" },
  { value: "likes", label: "Most Liked" },
];

const SortSelect = ({ value, onChange, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="sort-select" className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
        Sort by
      </label>
      <select
        id="sort-select"
        value={value || "latest"}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelect;
export { SORT_OPTIONS };
