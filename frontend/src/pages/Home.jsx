import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [userSchedules, setUserSchedules] = useState([]);
  const [friendSchedules, setFriendSchedules] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserSchedules = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/schedules', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSchedules(res.data);
      } catch (err) {
        console.error('Fetch gagal:', err);
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/friends', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(res.data);
      } catch (err) {
        console.error('Fetch friends gagal:', err);
      }
    };

    const getUsername = () => {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload.username);
    };

    fetchUserSchedules();
    fetchFriends();
    getUsername();
  }, []);

  const handleFriendClick = async (friendId) => {
    setSelectedFriendId(friendId);
    try {
      const res = await axios.get(`http://localhost:5000/api/schedules/${friendId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFriendSchedules(res.data);
    } catch (err) {
      console.error('Fetch friend schedules gagal:', err);
    }
  };

  const handleCellClick = (date, hour) => {
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    navigate('/schedules/add', { state: { startTime } });
  };

  const getScheduleClass = (visibility, isUser) => {
    const baseClass = isUser ? 'schedule-block-user' : 'schedule-block-friend';
    switch (visibility) {
      case 'public':
        return `${baseClass} schedule-block-public`;
      case 'private':
        return `${baseClass} schedule-block-private`;
      case 'hidden':
        return `${baseClass} schedule-block-hidden`;
      default:
        return baseClass;
    }
  };

  const renderCalendar = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="calendar">
        <div className="calendar-header">
          <div className="calendar-time-label">Jam</div>
          {weekDates.map((date) => (
            <div key={date} className="calendar-day">
              <div>{days[date.getDay()]}</div>
              <div>{date.toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        <div className="calendar-body">
          {hours.map((hour) => (
            <div key={hour} className="calendar-row">
              <div className="calendar-time-label">{`${hour}:00`}</div>
              {weekDates.map((date) => (
                <div
                  key={date + hour}
                  className="calendar-cell"
                  onClick={() => handleCellClick(date, hour)}
                >
                  {[...userSchedules, ...friendSchedules]
                    .filter(
                      (schedule) =>
                        new Date(schedule.start_time).getDay() === date.getDay() &&
                        new Date(schedule.start_time).getHours() === hour
                    )
                    .map((schedule, index) => (
                      <div
                        key={index}
                        className={`schedule-block ${getScheduleClass(
                          schedule.visibility,
                          userSchedules.includes(schedule)
                        )}`}
                        title={`${schedule.title} (${schedule.start_time} - ${schedule.end_time})`}
                      >
                        <div className="schedule-title">{schedule.title}</div>
                        <div className="text-xs text-white">
                          Owner: {userSchedules.includes(schedule) ? 'You' : schedule.owner_name}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-[#1e1e2e] flex">
      <div className="w-1/4 p-4 bg-[#302d41] shadow rounded">
        <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Friends</h2>
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="cursor-pointer hover:underline text-[#cdd6f4]"
              onClick={() => handleFriendClick(friend.id)}
            >
              {friend.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4 text-[#cdd6f4]">Hi, {user} 👋</h1>
        {renderCalendar()}
      </div>
    </div>
  );
}

export default Home;
