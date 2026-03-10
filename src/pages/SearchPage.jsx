import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const [stories, setStories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const company = params.get("company");
    const role = params.get("role");

    const fetchStories = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/stories/search?company=${company}&role=${role}`
      );
      const data = await res.json();
      setStories(data);
    };

    fetchStories();
  }, [location.search]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Search Results</h2>

      {stories.length === 0 ? (
        <p>No stories found.</p>
      ) : (
        stories.map((story) => (
          <div key={story._id} className="bg-slate-800 p-4 mb-4 rounded-xl">
            <h3 className="text-lg font-semibold">{story.title}</h3>
            <p className="text-sm text-slate-400">
              {story.company} • {story.role}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchPage;