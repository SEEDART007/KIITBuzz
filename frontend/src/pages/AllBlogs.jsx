import { useEffect, useRef, useState, useCallback } from "react";
import api from "../api/api";
import PostCard from "../components/Postcard";
import { toast } from "react-toastify";

export default function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);
  const loadingRef = useRef(false); // 🔒 lock to prevent race

  /* ================= MERGE POSTS ================= */

  const mergePosts = (oldPosts, newPosts) => {
    const map = new Map();
    [...oldPosts, ...newPosts].forEach(post => map.set(post._id, post));
    return Array.from(map.values());
  };

  /* ================= FETCH ================= */

  const fetchPosts = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const lastId = posts[posts.length - 1]?._id;

      const res = await api.get(
        `/blogs?limit=10${lastId ? `&lastId=${lastId}` : ""}`
      );

      if (!res.data || res.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => mergePosts(prev, res.data));
      }
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [posts, hasMore]);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ================= OBSERVER ================= */

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 0.8 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchPosts]);

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Campus Buzz</h1>

      {posts.length === 0 && !loading && (
        <p className="text-center text-gray-500">
          No blogs yet. Be the first to write one ✍️
        </p>
      )}

      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && (
        <p className="text-center text-gray-500 mt-6">
          Loading more posts...
        </p>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-400 mt-6">
          You’ve reached the end 🎉
        </p>
      )}

      <div ref={observerRef} className="h-10" />
    </div>
  );
}
