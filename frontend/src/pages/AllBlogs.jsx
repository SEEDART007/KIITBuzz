import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import PostCard from "../components/Postcard";


export default function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await api.get(`/blogs?page=${page}&limit=10`);

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...res.data]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Failed to load posts");
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
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [observerRef.current, hasMore]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Campus Buzz</h1>

      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && (
        <p className="text-center text-gray-500 mt-6">
          Loading more posts...
        </p>
      )}

      {!hasMore && (
        <p className="text-center text-gray-400 mt-6">
          You’ve reached the end 🎉
        </p>
      )}

      {/* Observer target */}
      <div ref={observerRef} className="h-10"></div>
    </div>
  );
}
