import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [schedules, setSchedules] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchSchedules = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/schedules', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(res.data);
      } catch (err) {
        console.error('Fetch gagal:', err);
      }
    };

    const getUsername = () => {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload.username);
    };

    fetchSchedules();
    getUsername();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Hi, {user} 👋</h1>
      <h2 className="text-xl mb-4">Jadwal Kamu:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map(s => (
          <div key={s.id} className="bg-white p-4 rounded shadow card">
            <h3 className="font-bold">{s.title}</h3>
            <p>{s.description}</p>
            <p className="text-sm text-gray-500">{s.start_time} → {s.end_time}</p>
            <p className="text-xs italic">({s.visibility})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
