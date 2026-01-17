import { useEffect, useState } from "react";
import api from "../api/api";
import PostCard from "../components/PostCard";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const res = await api.get("/blogs/getMyBlogs");
        setPosts(res.data.blogs);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to load your blogs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  // ✅ DELETE HANDLER
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/blogs/${postId}`);
      toast.success("Post deleted");

      // ✅ remove from UI
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete post"
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Blogs</h1>

        {loading && (
          <p className="text-gray-500 text-center">Loading blogs...</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-gray-500 text-center">
            You haven’t written any blogs yet.
          </p>
        )}

        {!loading &&
          posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDelete} // ✅ PASS HANDLER
            />
          ))}
      </div>
    </div>
  );
}
