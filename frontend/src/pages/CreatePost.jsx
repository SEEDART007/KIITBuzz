import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/posts", { title, content, category });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating post");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Create a Post</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)}
            className="w-full p-3 mb-4 border rounded h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="general">General</option>
            <option value="course_review">Course Review</option>
            <option value="professor_review">Professor Review</option>
            <option value="exam_tip">Exam Tip</option>
            <option value="confession">Confession</option>
            <option value="internship">Internship</option>
            <option value="event">Event</option>
            <option value="notes">Notes</option>
          </select>
          <button type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">Post</button>
        </form>
      </div>
    </div>
  );
}
