import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, ThumbsUp, Trash2 } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../../context/AuthContext";

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(post.hasUpvoted || false);
  const [upvoting, setUpvoting] = useState(false);

  

  /* ================= OWNERSHIP ================= */

  const isOwner =
    user &&
    post.author &&
    (post.author._id === user._id || post.author === user._id);

  /* ================= UPVOTE ================= */

  const handleUpvote = async () => {
    if (hasUpvoted || upvoting) return;

    setHasUpvoted(true);
    setUpvotes(prev => prev + 1);
    setUpvoting(true);

    try {
      const res = await api.post(`/blogs/${post._id}/upvote`);
      setUpvotes(res.data.upvotes);
      toast.success("Upvoted");
    } catch (err) {
      setHasUpvoted(false);
      setUpvotes(prev => prev - 1);
      toast.error(err?.response?.data?.msg || "Failed to upvote");
    } finally {
      setUpvoting(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDeleteClick = () => {
    if (!onDelete) return;

    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    onDelete(post._id);
  };

  /* ================= UI ================= */

  const previewContent =
    post.content.length > 200
      ? post.content.slice(0, 200) + "..."
      : post.content;
  // const displayName = post.author?.username || "Anonymous";
  return (
    <div className="bg-white p-6 rounded shadow mb-6 hover:shadow-lg transition flex flex-col justify-between min-h-[250px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img
            src={post.author?.avatar || "/avatars/default.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="text-sm text-gray-500">
            <span className="font-semibold">{post.author?.username || "Anonymous"}</span>{" "}
            {post.author?.department} {post.author?.year} | {post.category}
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/blogs/edit/${post._id}`)}
              className="text-blue-500 hover:text-blue-700"
              title="Edit post"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700"
              title="Delete post"
            >
              <Trash2 size={18} />
            </button>
          </div>
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
          disabled={hasUpvoted || upvoting}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition 
            ${
              hasUpvoted
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          <ThumbsUp size={18} />
          <span>{upvotes}</span>
        </button>

        <span className="text-sm text-gray-500">{post.views} views</span>

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
