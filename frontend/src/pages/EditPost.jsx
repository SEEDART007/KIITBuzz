import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: ""
  });

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then(res => setForm(res.data))
      .catch(() => toast.error("Failed to load post"));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/blogs/blogs/${id}`, form);
      toast.success("Post updated");
      navigate(`/blogs/${id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4">Edit Blog</h1>

      <input
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        className="w-full mb-3 p-2 border rounded"
        placeholder="Title"
      />

      <textarea
        value={form.content}
        onChange={e => setForm({ ...form, content: e.target.value })}
        rows={6}
        className="w-full mb-3 p-2 border rounded"
        placeholder="Content"
      />

      <input
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Category"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Update
      </button>
    </form>
  );
}
