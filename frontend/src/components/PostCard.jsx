import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

export default function PostCard({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(post.hasUpvoted || false);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (hasUpvoted || loading) return;

    setHasUpvoted(true);
    setUpvotes(prev => prev + 1);
    setLoading(true);

    try {
      const res = await api.post(`/blogs/${post._id}/upvote`);
      setUpvotes(res.data.upvotes);
      toast.success("Upvoted successfully! 👍");
    } catch (err) {
      setHasUpvoted(false);
      setUpvotes(prev => prev - 1);
      toast.error(err.response?.data?.msg || "Error upvoting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-4 hover:shadow-lg transition">
      {/* Header: Avatar + Anonymous + Category */}
      <div className="flex items-center mb-3">
        <img
          src={post.author?.avatar || "/avatars/default.png"} // load avatar from user
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <span className="font-semibold">Anonymous</span>
          <span className="text-sm text-gray-500 ml-2">{post.category}</span>
        </div>
      </div>

      {/* Post title & content */}
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>

      {/* Upvote button */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{post.authorTag}</span>
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted || loading}
          className={`px-3 py-1 rounded transition ${
            hasUpvoted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Upvote ({upvotes})
        </button>
      </div>
    </div>
  );
}
