import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

export default function BlogPage() {
  const { id } = useParams(); // get post ID from URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteLoading, setUpvoteLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setPost(res.data);
        setUpvotes(res.data.upvotes || 0);
        setHasUpvoted(res.data.hasUpvoted || false);
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpvote = async () => {
    if (hasUpvoted || upvoteLoading) return;

    setHasUpvoted(true);
    setUpvotes(prev => prev + 1);
    setUpvoteLoading(true);

    try {
      const res = await api.post(`/blogs/${id}/upvote`);
      setUpvotes(res.data.upvotes);
      toast.success("Upvoted successfully! 👍");
    } catch (err) {
      setHasUpvoted(false);
      setUpvotes(prev => prev - 1);
      toast.error(err.response?.data?.msg || "Error upvoting");
    } finally {
      setUpvoteLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src={post.author?.avatar || "/avatars/default.png"}
          alt="avatar"
          className="w-12 h-12 rounded-full mr-3"
        />
        <div className="text-sm text-gray-500">
          <span className="font-semibold">{post.author?.username || "Anonymous"}</span>{" "}
          {post.author?.department} {post.author?.year} | {post.category}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

      {/* Content */}
      <p className="text-gray-700 whitespace-pre-line mb-6">{post.content}</p>

      {/* Footer: Upvote + Views */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted || upvoteLoading}
          className={`px-4 py-2 rounded transition ${
            hasUpvoted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Upvote ({upvotes})
        </button>
        <span className="text-gray-500">{post.views || 0} views</span>
      </div>

      <button
        onClick={() => navigate(-1)} // Go back to feed
        className="text-blue-600 hover:underline"
      >
        ← Back to feed
      </button>
    </div>
  );
}
