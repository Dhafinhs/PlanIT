import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold hover:text-blue-300 transition duration-300">PlanIt</h1>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/" className="hover:text-blue-300 transition duration-300">Home</Link>
              <Link to="/schedules" className="hover:text-blue-300 transition duration-300">Schedules</Link>
              <Link to="/friends" className="hover:text-blue-300 transition duration-300">Friends</Link>
              <button onClick={handleLogout} className="hover:underline hover:text-blue-300 transition duration-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300 transition duration-300">Login</Link>
              <Link to="/register" className="hover:text-blue-300 transition duration-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
