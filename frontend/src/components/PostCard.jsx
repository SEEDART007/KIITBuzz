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
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{post.authorTag} | {post.category}</span>
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted || loading}
          className={`px-3 py-1 rounded transition ${hasUpvoted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Upvote ({upvotes})
        </button>
      </div>
    </div>
  );
}
