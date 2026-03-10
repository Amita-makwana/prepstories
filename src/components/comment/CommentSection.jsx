import { useEffect, useState } from "react";
import api from "../../services/api";
import CommentItem from "./CommentItem";
import { useAuth } from "../../context/AuthContext";

const CommentSection = ({ storyId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    const res = await api.get(`/comments/${storyId}`);
    setComments(res.data.comments);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async () => {
    if (!content) return;
    await api.post(`/comments/${storyId}`, { content });
    setContent("");
    fetchComments();
  };

  return (
    <div className="space-y-4">
      {user && (
        <div className="flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl placeholder-slate-500"
            placeholder="Add a comment..."
          />
          <button
            onClick={handleSubmit}
            className="bg-indigo-500 dark:bg-indigo-400 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-300"
          >
            Post
          </button>
        </div>
      )}

      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          storyId={storyId}
          refresh={fetchComments}
        />
      ))}
    </div>
  );
};

export default CommentSection;