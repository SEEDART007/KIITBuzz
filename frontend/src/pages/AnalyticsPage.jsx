import { useEffect, useState } from "react";
import api from "../api/api"; // your axios instance
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function AnalyticsPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FF3333"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          api.get("/getAll"),
          api.get("/blogs/get-posts"),
        ]);
        setUsers(usersRes.data);
        setPosts(postsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading analytics...</div>;

  // Summary calculations
  const totalUsers = users.length;
  const bannedUsers = users.filter(u => u.isBanned).length;
  const totalPosts = posts.length;

  // Posts per user (safe check for missing author)
  const postsPerUser = users
    .map(u => {
      const userPosts = posts.filter(p => p.author && p.author._id === u._id);
      return { name: u.email, posts: userPosts.length };
    })
    .filter(u => u.posts > 0); // only users with posts

  // Active vs banned users pie chart
  const bannedData = [
    { name: "Active Users", value: totalUsers - bannedUsers },
    { name: "Banned Users", value: bannedUsers }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Banned Users</h2>
          <p className="text-2xl font-bold">{bannedUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Total Posts</h2>
          <p className="text-2xl font-bold">{totalPosts}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Posts per user bar chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Posts per User</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postsPerUser} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active vs Banned users pie chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Active vs Banned Users</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bannedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {bannedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
