import { useEffect, useState } from 'react';
import axios from 'axios';

function Schedules() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/schedules', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 animate-slide-up">
      <h1 className="text-2xl font-bold mb-4">Your Schedules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="p-4 bg-white shadow rounded card">
            <h2 className="text-xl font-bold">{schedule.title}</h2>
            <p>{schedule.description}</p>
            <p className="text-sm text-gray-500">{schedule.start_time} - {schedule.end_time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedules;
