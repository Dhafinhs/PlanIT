import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function FriendSchedules() {
  const { friendId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriendSchedules = async () => {
      setLoading(true);
      try {
        const res = await api.getFriendSchedules(friendId);
        setSchedules(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFriendSchedules();
  }, [friendId]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Friend's Schedules</h1>
      {loading && <div className="spinner mx-auto"></div>}
      {!loading && schedules.length === 0 && (
        <p className="empty-state">This friend has no schedules available.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold">{schedule.title}</h2>
            <p>{schedule.description}</p>
            <p className="text-sm text-gray-500">
              {schedule.start_time} - {schedule.end_time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendSchedules;
