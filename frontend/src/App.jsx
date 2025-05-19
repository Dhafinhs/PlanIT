import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Schedules from './pages/Schedules';
import Friends from './pages/Friends';
import FriendSchedules from './pages/FriendSchedules';
import ProtectedRoute from './components/ProtectedRoute';
import AddSchedule from './pages/AddSchedule';
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <ProtectedRoute>
              <Schedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends/:friendId/schedules"
          element={
            <ProtectedRoute>
              <FriendSchedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules/add"
          element={
            <ProtectedRoute>
              <AddSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/create"
          element={
            <ProtectedRoute>
              <CreateGroup />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
