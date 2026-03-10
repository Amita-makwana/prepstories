import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import AddStory from "./pages/AddStory";
import StoryDetails from "./pages/StoryDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Profile from "./pages/Profile";
import EditStory from "./pages/EditStory";
import Explore from "./pages/Explore";
import About from "./pages/About";
import CompanyPage from "./pages/CompanyPage";
import Leaderboard from "./pages/Leaderboard";
import { useAuth } from "./context/AuthContext";
import toast from "react-hot-toast";

function LoginSuccessHandler() {
  const { refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "success") {
      refreshUser?.();
      toast.success("You have signed in successfully.");
      params.delete("login");
      const qs = params.toString();
      navigate(location.pathname + (qs ? `?${qs}` : ""), { replace: true });
    }
  }, [location.search, refreshUser, navigate, location.pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--toast-bg, #1e293b)",
              color: "#f1f5f9",
            },
          }}
        />
        <BrowserRouter>
        <LoginSuccessHandler />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditStory />
              </ProtectedRoute>
            }
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/company/:companyName" element={<CompanyPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddStory />
              </ProtectedRoute>
            }
          />
          <Route path="/story/:id" element={<StoryDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;