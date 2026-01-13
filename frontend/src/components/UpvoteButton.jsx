import { useState } from "react";
import api from "../api/axios";

const UpvoteButton = ({ postId, initialUpvotes, initiallyUpvoted }) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [upvoted, setUpvoted] = useState(initiallyUpvoted);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (upvoted || loading) return;

    try {
      setLoading(true);

      // Optimistic UI
      setUpvotes(prev => prev + 1);
      setUpvoted(true);

      await api.post(`/blogs/${postId}/upvote`);
    } catch (err) {
      // rollback
      setUpvotes(prev => prev - 1);
      setUpvoted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={upvoted || loading}
      className={`upvote-btn ${upvoted ? "active" : ""}`}
    >
      ▲ {upvotes}
    </button>
  );
};

export default UpvoteButton;
