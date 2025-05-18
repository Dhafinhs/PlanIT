import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.svg'; // Import logo.svg

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-[#302d41] text-[#cdd6f4] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="PlanIt Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-extrabold text-[#89b4fa] tracking-wide hover:text-[#cdd6f4] transition duration-300">
            Plan<span className="text-[#f38ba8]">IT</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/" className="hover:text-[#89b4fa] transition duration-300">Home</Link>
              <Link to="/schedules" className="hover:text-[#89b4fa] transition duration-300">Schedules</Link>
              <Link to="/friends" className="hover:text-[#89b4fa] transition duration-300">Friends</Link>
              <button onClick={handleLogout} className="hover:underline hover:text-[#89b4fa] transition duration-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#89b4fa] transition duration-300">Login</Link>
              <Link to="/register" className="hover:text-[#89b4fa] transition duration-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
