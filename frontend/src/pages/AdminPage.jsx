import { useEffect, useState } from "react";
import api from "../api/api"

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/getAll");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
      alert("Failed to load users");
    }
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await api.get("/blogs/get-posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts", err);
      alert("Failed to load posts");
    }
  };

  // Ban a user
  const banUser = async (id) => {
    const reason = prompt("Enter ban reason");
    if (!reason) return;

    try {
      await api.put(`/auth/ban-user/${id}`, { reason });
      fetchUsers(); // refresh user list
    } catch (err) {
      console.error(err);
      alert("Failed to ban user");
    }
  };

  // Delete a post
  const deletePost = async (id) => {
    if (!confirm("Delete this post?")) return;

    try {
      await api.delete(`/blogs/delete-post/${id}`);
      fetchPosts(); // refresh post list
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
  {/* Users Panel */}
  <div className="border rounded-lg p-4 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Users</h2>
    {users.map((u) => (
      <div
        key={u._id}
        className="flex justify-between items-center py-2 border-b last:border-b-0"
      >
        <span className="truncate">
          {u.username}
          {u.isBanned && <strong className="text-red-600 ml-2">(BANNED)</strong>}
        </span>
        {!u.isBanned && (
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
            onClick={() => banUser(u._id)}
          >
            Ban
          </button>
        )}
      </div>
    ))}
  </div>

  {/* Posts Panel */}
  <div className="border rounded-lg p-4 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Posts</h2>
    {posts.map((p) => (
      <div
        key={p._id}
        className="flex justify-between items-center py-2 border-b last:border-b-0"
      >
        <span className="truncate">{p.title || p.content}</span>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
          onClick={() => deletePost(p._id)}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
</div>

  );
}
