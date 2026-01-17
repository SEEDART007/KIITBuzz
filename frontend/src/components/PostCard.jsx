import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import { ThumbsUp, Trash2 } from "lucide-react";
import {jwtDecode} from "jwt-decode";

export default function PostCard({ post, onDelete }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(post.hasUpvoted || false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= AUTH / OWNERSHIP ================= */

  const token = localStorage.getItem("token");
  let userId = null;

  try {
    userId = token ? jwtDecode(token)._id : null;
  } catch {
    userId = null;
  }

  const isOwner =
    post.author &&
    (post.author._id === userId || post.author === userId);

  /* ================= UPVOTE ================= */

  const handleUpvote = async () => {
    if (hasUpvoted || loading) return;

    setHasUpvoted(true);
    setUpvotes(prev => prev + 1);
    setLoading(true);

    try {
      const res = await api.post(`/blogs/${post._id}/upvote`);
      setUpvotes(res.data.upvotes);
      toast.success("Upvoted successfully 👍");
    } catch (err) {
      setHasUpvoted(false);
      setUpvotes(prev => prev - 1);
      toast.error(err?.response?.data?.msg || "Error upvoting");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE (OWNER ONLY) ================= */

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      await api.delete(`/blogs/${post._id}`);
      toast.success("Post deleted");
      onDelete(post._id); // ✅ remove from Dashboard state
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete post"
      );
    }
  };

  /* ================= UI ================= */

  const previewContent =
    post.content.length > 200
      ? post.content.slice(0, 200) + "..."
      : post.content;

  return (
    <div className="bg-white p-6 rounded shadow mb-6 hover:shadow-lg transition flex flex-col justify-between min-h-[250px]">
      
      {/* Header */}
      <div className="flex items-center mb-3 justify-between">
        <div className="flex items-center">
          <img
            src={post.author?.avatar || "/avatars/default.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="text-sm text-gray-500">
            <span className="font-semibold">Anonymous</span>{" "}
            {post.author?.department} {post.author?.year} | {post.category}
          </div>
        </div>

        {/* DELETE BUTTON (OWNER ONLY) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">
        {previewContent}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted || loading}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition 
            ${
              hasUpvoted
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md"
            }
          `}
        >
          <ThumbsUp size={18} />
          <span>{upvotes}</span>
        </button>

        <span className="text-sm text-gray-500">
          {post.views} views
        </span>

        <button
          onClick={() => navigate(`/blogs/${post._id}`)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Read More
        </button>
      </div>
    </div>
  );
}
