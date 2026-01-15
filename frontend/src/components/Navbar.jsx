import { NotebookPen, UserRoundPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Check if user is logged in (token exists)
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        KiitBuzz
      </Link>
      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-center space-x-4">
  {/* Create Post */}
  <Link
    to="/create"
    className="p-2 rounded hover:bg-blue-500 transition flex items-center"
    title="Create Post"
  >
    <NotebookPen size={20} />
  </Link>

  {/* Profile */}
  <Link
    to="/profile"
    className="p-2 rounded hover:bg-green-500 transition flex items-center"
    title="Profile"
  >
    <UserRoundPen size={20} />
  </Link>
</div>

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
    </nav>
  );
}
