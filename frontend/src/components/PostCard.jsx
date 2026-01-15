import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import { ThumbsUp } from "lucide-react";

export default function PostCard({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(post.hasUpvoted || false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  // Show only first 200 characters as preview
  const previewContent =
    post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content;

  return (
    <div className="bg-white p-6 rounded shadow mb-6 hover:shadow-lg transition flex flex-col justify-between min-h-[250px]">
      {/* Header: Avatar + meta */}
      <div className="flex items-center mb-3">
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

      {/* Title and preview */}
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{previewContent}</p>

      {/* Footer: Upvote, views, Read More */}
      <div className="flex justify-between items-center mt-auto">
      <button
  onClick={handleUpvote}
  disabled={hasUpvoted || loading}
  aria-label={hasUpvoted ? "Already upvoted" : "Upvote this post"}
  className={`
    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition 
    ${hasUpvoted 
        ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
        : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md"}
  `}
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
