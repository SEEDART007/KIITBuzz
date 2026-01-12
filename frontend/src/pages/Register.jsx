import { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { email, password, department, year });
      login(res.data.token); // auto-login
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <input placeholder="Year" value={year} onChange={e => setYear(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <button type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">Register</button>
      </form>
    </div>
  );
}
