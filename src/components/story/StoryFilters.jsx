import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";

const StoryFilters = ({ filters, setFilters }) => {
  const [company, setCompany] = useState(filters.company || "");
  const [role, setRole] = useState(filters.role || "");

  const debouncedCompany = useDebounce(company, 500);
  const debouncedRole = useDebounce(role, 500);

  // Auto-apply search when user stops typing
  useEffect(() => {
    setFilters({
      ...filters,
      company: debouncedCompany,
      role: debouncedRole,
    });
  }, [debouncedCompany, debouncedRole]);

  const resetFilters = () => {
    setCompany("");
    setRole("");
    setFilters({
      company: "",
      role: "",
      sort: "latest",
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 md:items-center justify-between">

      {/* Search Inputs */}
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

        <input
          type="text"
          placeholder="Search company..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="bg-slate-800 px-4 py-2 rounded-xl outline-none text-sm"
        />

        <input
          type="text"
          placeholder="Search role..."
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-slate-800 px-4 py-2 rounded-xl outline-none text-sm"
        />

      </div>

      {/* Sort + Reset */}
      <div className="flex gap-3 items-center">

        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value })
          }
          className="bg-slate-800 px-4 py-2 rounded-xl text-sm"
        >
          <option value="latest">Latest</option>
          <option value="trending">Trending</option>
          <option value="upvotes">Most Upvoted</option>
        </select>

        <button
          onClick={resetFilters}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          Reset
        </button>

      </div>
    </div>
  );
};

export default StoryFilters;