import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import PostCard from "../components/Postcard";

export default function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  // Merge new posts, remove duplicates by _id
  const mergePosts = (oldPosts, newPosts) => {
    const map = new Map();
    [...oldPosts, ...newPosts].forEach(post => map.set(post._id, post));
    return Array.from(map.values());
  };

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const lastId = posts[posts.length - 1]?._id;
      const res = await api.get(
        `/blogs?limit=10${lastId ? `&lastId=${lastId}` : ""}`
      );

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => mergePosts(prev, res.data));
      }
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { root: null, threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [observerRef, hasMore, loading]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Campus Buzz</h1>

      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && (
        <p className="text-center text-gray-500 mt-6">Loading more posts...</p>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-400 mt-6">You’ve reached the end 🎉</p>
      )}

      <div ref={observerRef} className="h-10"></div>
    </div>
  );
}
