import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
        DemoBuilder
      </Link>

      <div className="flex gap-x-4 items-center">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </Link>
        {/* More nav links if needed */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
