import {
  BookOpen,
  NotebookPen,
  UserRoundPen,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          KiitBuzz
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="p-2 rounded hover:bg-indigo-500 transition"
                title="My Blogs"
              >
                <LayoutDashboard size={20} />
              </Link>

              <Link
                to="/create"
                className="p-2 rounded hover:bg-blue-500 transition"
                title="Create Post"
              >
                <NotebookPen size={20} />
              </Link>

              <Link
                to="/blogs"
                className="p-2 rounded hover:bg-amber-500 transition"
                title="Blogs"
              >
                <BookOpen size={20} />
              </Link>

              <Link
                to="/profile"
                className="p-2 rounded hover:bg-green-500 transition"
                title="Profile"
              >
                <UserRoundPen size={20} />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col space-y-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded hover:bg-indigo-500"
              >
                <LayoutDashboard size={18} /> My Blogs
              </Link>

              <Link
                to="/create"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded hover:bg-blue-500"
              >
                <NotebookPen size={18} /> Create Post
              </Link>

              <Link
                to="/blogs"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded hover:bg-amber-500"
              >
                <BookOpen size={18} /> Blogs
              </Link>

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded hover:bg-green-500"
              >
                <UserRoundPen size={18} /> Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="p-2 rounded hover:bg-blue-500"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="p-2 rounded hover:bg-blue-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
