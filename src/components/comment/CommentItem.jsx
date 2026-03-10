import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CommentItem = ({ comment, storyId, refresh }) => {
  const { user } = useAuth();
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleReply = async () => {
    await api.post(`/comments/${storyId}`, {
      content: reply,
      parent: comment._id
    });
    setReply("");
    setShowReply(false);
    refresh();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {comment.author.name}
      </p>
      <p className="text-slate-700 dark:text-slate-200">{comment.content}</p>

      {user && (
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-indigo-500 dark:text-indigo-400 text-sm mt-2 hover:underline"
        >
          Reply
        </button>
      )}

      {showReply && (
        <div className="mt-2 flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700"
          />
          <button
            onClick={handleReply}
            className="bg-indigo-500 dark:bg-indigo-400 text-white px-3 py-1 rounded-xl hover:bg-indigo-600"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;