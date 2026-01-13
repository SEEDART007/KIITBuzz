import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me"); // must include Authorization header
        setUser(res.data);
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user data</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>

      <div className="mb-4">
        <p className="text-gray-600">Email:</p>
        <p className="text-lg">{user.email}</p>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">Department:</p>
        <p className="text-lg">{user.department}</p>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">Year:</p>
        <p className="text-lg">{user.year}</p>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
