import { Link, useNavigate } from "react-router-dom";
import { getAuthBaseUrl } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/explore?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-indigo-500 dark:text-indigo-400 transition-colors"
        >
          PrepStories
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl"
        >
          <input
            type="text"
            placeholder="Search company, role, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 w-48 lg:w-64"
          />
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/explore"
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
          >
            Explore
          </Link>
          <Link
            to="/leaderboard"
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
          >
            Leaderboard
          </Link>
          <Link
            to="/about"
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
          >
            About
          </Link>

          <button
            onClick={() => {
              if (user) navigate("/add");
              else
                window.location.href = `${getAuthBaseUrl()}/api/auth/google`;
            }}
            className="bg-indigo-500 dark:bg-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-300 text-white dark:text-slate-950 px-4 py-2 rounded-xl transition font-medium"
          >
            Add Story
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={user.avatar}
                alt={`${user.name} profile avatar`}
                loading="lazy"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((prev) => !prev);
                }}
                className="w-9 h-9 rounded-full cursor-pointer border border-slate-200 dark:border-slate-700"
              />

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-2 z-50">

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      toast.success("You have signed out successfully.");
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            <a
              href={`${getAuthBaseUrl()}/api/auth/google`}
              className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-medium"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
