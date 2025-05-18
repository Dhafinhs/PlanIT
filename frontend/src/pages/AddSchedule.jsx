import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function AddSchedule() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: location.state?.startTime || '',
    end_time: '',
    visibility: 'public',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/schedules',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Schedule added successfully!');
      navigate('/schedules');
    } catch (err) {
      alert('Failed to add schedule: ' + err.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e2e]">
      <form onSubmit={handleSubmit} className="bg-[#302d41] p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Add Schedule</h2>
        <input
          name="title"
          placeholder="Title"
          className="w-full border p-2 mb-3"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 mb-3"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="start_time"
          className="w-full border p-2 mb-3"
          value={form.start_time}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="end_time"
          className="w-full border p-2 mb-3"
          value={form.end_time}
          onChange={handleChange}
        />
        <select
          name="visibility"
          className="w-full border p-2 mb-3"
          value={form.visibility}
          onChange={handleChange}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="hidden">Hidden</option>
        </select>
        <button className="w-full py-2">Add Schedule</button>
      </form>
    </div>
  );
}

export default AddSchedule;
