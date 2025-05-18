import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Schedules from './pages/Schedules';
import Friends from './pages/Friends';
import FriendSchedules from './pages/FriendSchedules';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/schedules" element={
          <ProtectedRoute>
            <Schedules />
          </ProtectedRoute>
        } />
        <Route path="/friends" element={
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        } />
        <Route path="/friends/:friendId/schedules" element={
          <ProtectedRoute>
            <FriendSchedules />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
