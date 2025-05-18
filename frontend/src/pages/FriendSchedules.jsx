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

  const getCardClass = (visibility) => {
    switch (visibility) {
      case 'public':
        return 'card card-public';
      case 'private':
        return 'card card-private';
      default:
        return 'card';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#1e1e2e]">
      <h1 className="text-2xl font-bold mb-4 text-[#cdd6f4]">Friend's Schedules</h1>
      {loading && <div className="spinner mx-auto"></div>}
      {!loading && schedules.length === 0 && (
        <p className="empty-state">This friend has no schedules available.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className={getCardClass(schedule.visibility)}>
            <h2 className="card-title">{schedule.title}</h2>
            {schedule.description && <p className="card-description">{schedule.description}</p>}
            <p className="card-time">
              {schedule.start_time} - {schedule.end_time}
            </p>
            <p className="text-sm text-white">Owner: {schedule.owner_name}</p> {/* Gunakan nama pemilik jadwal */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendSchedules;
