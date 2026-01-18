import { Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Hero from "./pages/Hero";
import AllBlogs from "./pages/AllBlogs";
import BlogPage from "./pages/BlogPage";
import AdminPage from "./pages/AdminPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import EditPost from "./pages/EditPost";
import About from "./pages/About";

/* ---------------- PROTECTED ROUTES ---------------- */

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    // Invalid token
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

/* ---------------- APP ---------------- */

function App() {
  return (
    <>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Hero />} />

        {/* Public */}
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute>
              <BlogPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="/blogs/edit/:id" element={<EditPost />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/analytics"
          element={
            <AdminRoute>
              <AnalyticsPage />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<h1 className="text-center mt-20">404 - Page Not Found</h1>}
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
