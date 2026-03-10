import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search company, role, or content...",
  debounceMs = 350,
  suggestions = [],
  onSuggestionSelect,
  showClear = true,
  className = "",
}) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(localValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSubmit?.(localValue);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange?.("");
    inputRef.current?.focus();
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (s) => {
    setLocalValue(s);
    onSuggestionSelect?.(s);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const hasSuggestions = suggestions.length > 0 && localValue.trim().length > 0;

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            strokeWidth={2}
          />
          <input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onFocus={() => hasSuggestions && setShowSuggestions(true)}
            placeholder={placeholder}
            className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 ${className}`}
            aria-label="Search"
          />
          {showClear && localValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && hasSuggestions && (
        <ul
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg z-50 max-h-60 overflow-auto"
        >
          {suggestions.slice(0, 8).map((s, i) => (
            <li key={`${s}-${i}`}>
              <button
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
