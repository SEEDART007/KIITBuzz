import { useEffect, useState } from "react";
import api from "../api/api";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
        {posts.length === 0 && <p className="text-gray-500">No posts yet</p>}
        {posts.map(post => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
