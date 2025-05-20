import { useEffect, useState } from 'react';
import axios from 'axios';

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [filter, setFilter] = useState('all'); // Filter state
  const [showEditForm, setShowEditForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    visibility: 'public',
    id: null,
  });

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://planitbackend-production.up.railway.app/api/schedules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data);
      setFilteredSchedules(res.data); // Initialize filtered schedules
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value === 'all') {
      setFilteredSchedules(schedules);
    } else {
      setFilteredSchedules(schedules.filter((schedule) => schedule.visibility === value));
    }
  };

  const handleEditClick = (schedule) => {
    setForm({
      title: schedule.title || '',
      description: schedule.description || '',
      start_time: schedule.start_time.slice(0, 16),
      end_time: schedule.end_time.slice(0, 16),
      visibility: schedule.visibility || 'public',
      id: schedule.id,
    });
    setShowEditForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://planitbackend-production.up.railway.app/api/schedules/${form.id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Schedule updated successfully!');
      setShowEditForm(false);
      fetchSchedules();
    } catch (err) {
      alert('Failed to update schedule: ' + err.response?.data?.error);
    }
  };

  const getCardClass = (visibility) => {
    switch (visibility) {
      case 'public':
        return 'card card-public';
      case 'private':
        return 'card card-private';
      case 'hidden':
        return 'card card-hidden';
      default:
        return 'card';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#1e1e2e] animate-slide-up">
      <h1 className="text-3xl font-bold mb-6 text-[#cdd6f4]">Your Schedules</h1>

      {/* Filter Section */}
      <div className="mb-6 bg-[#302d41] p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-[#cdd6f4]">Filter Schedules</h2>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="w-full p-2 bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] rounded-lg"
        >
          <option value="all">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Schedules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchedules.map((schedule) => (
          <div key={schedule.id} className={getCardClass(schedule.visibility)}>
            <h2 className="card-title">{schedule.title}</h2>
            {schedule.description && <p className="card-description">{schedule.description}</p>}
            <p className="card-time">
              {new Date(schedule.start_time).toLocaleString()} -{' '}
              {new Date(schedule.end_time).toLocaleString()}
            </p>
            <p className="text-sm text-white">Owner: You</p>
            <button
              onClick={() => handleEditClick(schedule)}
              className="mt-2 bg-[#89b4fa] text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Schedule Form */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#302d41] p-6 rounded shadow-md w-96 relative">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Edit Schedule</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                name="title"
                placeholder="Title"
                className="w-full border p-2 mb-3"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full border p-2 mb-3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <input
                type="datetime-local"
                name="start_time"
                className="w-full border p-2 mb-3"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
              <input
                type="datetime-local"
                name="end_time"
                className="w-full border p-2 mb-3"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
              <select
                name="visibility"
                className="w-full border p-2 mb-3"
                value={form.visibility}
                onChange={(e) => setForm({ ...form, visibility: e.target.value })}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="hidden">Hidden</option>
              </select>
              <button className="w-full py-2 bg-[#89b4fa] text-white rounded">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedules;
