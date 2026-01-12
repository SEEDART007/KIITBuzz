import { useState } from "react";
import api from "../api/api";

export default function PostCard({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);

  const handleUpvote = async () => {
    try {
      const res = await api.post(`/posts/${post._id}/upvote`);
      setUpvotes(res.data.upvotes);
    } catch (err) {
      alert(err.response?.data?.msg || "Error upvoting");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-4 hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{post.authorTag} | {post.category}</span>
        <button onClick={handleUpvote} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Upvote ({upvotes})
        </button>
      </div>
    </div>
  );
}
