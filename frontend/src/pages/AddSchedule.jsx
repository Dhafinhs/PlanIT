import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [scheduleType, setScheduleType] = useState('personal'); // State untuk tipe jadwal
  const [groups, setGroups] = useState([]); // State untuk daftar grup
  const [selectedGroup, setSelectedGroup] = useState(''); // State untuk grup yang dipilih

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://planitbackend-production.up.railway.app/api/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (scheduleType === 'personal') {
        await axios.post(
          'https://planitbackend-production.up.railway.app/api/schedules',
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (scheduleType === 'group' && selectedGroup) {
        await axios.post(
          `https://planitbackend-production.up.railway.app/api/groups/${selectedGroup}/schedule`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
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
        <div className="mb-4">
          <label className="block text-[#cdd6f4] mb-2">Schedule Type</label>
          <select
            value={scheduleType}
            onChange={(e) => setScheduleType(e.target.value)}
            className="w-full border p-2 mb-3"
          >
            <option value="personal">Personal</option>
            <option value="group">Group</option>
          </select>
        </div>
        {scheduleType === 'group' && (
          <div className="mb-4">
            <label className="block text-[#cdd6f4] mb-2">Select Group</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full border p-2 mb-3"
            >
              <option value="">-- Select Group --</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        )}
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
        {scheduleType === 'personal' && (
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
        )}
        <button className="w-full py-2 bg-[#89b4fa] text-white rounded">
          Add Schedule
        </button>
      </form>
    </div>
  );
}

export default AddSchedule;
