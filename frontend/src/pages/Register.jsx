import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        username,
        email,
        password,
        department,
        year
      });

      // 🔐 Auto-login (if email verification not enforced yet)
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {/* Username */}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Email */}
        <input
          placeholder="University Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Password */}
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Department */}
        <input
          placeholder="Department"
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Year */}
        <input
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
          className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
