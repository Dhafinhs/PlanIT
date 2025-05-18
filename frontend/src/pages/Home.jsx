import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [userSchedules, setUserSchedules] = useState([]);
  const [friendSchedules, setFriendSchedules] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allSchedules, setAllSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);

    const fetchUserSchedules = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/schedules', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSchedules(res.data);
        setAllSchedules(res.data);
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

    fetchUserSchedules();
    fetchFriends();
  }, []);

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleFriendToggle = async (friendId, checked) => {
    if (checked) {
      try {
        const res = await axios.get(`http://localhost:5000/api/schedules/${friendId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const friendSchedules = res.data.map(schedule => ({
          ...schedule,
          isFriendSchedule: true,
          friendId: friendId
        }));
        setAllSchedules(prev => [...prev, ...friendSchedules]);
        setSelectedFriends(prev => [...prev, friendId]);
      } catch (err) {
        console.error('Fetch friend schedules failed:', err);
      }
    } else {
      setAllSchedules(prev => prev.filter(schedule => 
        !schedule.isFriendSchedule || schedule.friendId !== friendId
      ));
      setSelectedFriends(prev => prev.filter(id => id !== friendId));
    }
  };

  const handleCellClick = (date, hour) => {
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    
    navigate('/schedules/add', {
      state: {
        startTime: startTime.toISOString().slice(0, 16)
      }
    });
  };

  const renderScheduleBlock = (schedule, time) => {
    const startHour = new Date(schedule.start_time).getHours();
    const endHour = new Date(schedule.end_time).getHours();
    const duration = endHour - startHour;

    // Get class based on whether it's user's own schedule or friend's schedule
    const getScheduleClass = () => {
      if (!schedule.isFriendSchedule) {
        switch (schedule.visibility) {
          case 'public': return 'schedule-block-own-public';
          case 'private': return 'schedule-block-own-private';
          case 'hidden': return 'schedule-block-own-hidden';
          default: return '';
        }
      } else {
        // Assign different colors to different friends using modulo
        const friendIndex = selectedFriends.indexOf(schedule.friendId) % 5;
        return `schedule-block-friend-${friendIndex}`;
      }
    };

    return (
      <div
        className={`schedule-block ${getScheduleClass()}`}
        style={{
          top: `${(startHour - parseInt(time)) * 100}%`,
          height: `${duration * 100}%`,
        }}
      >
        <div className="schedule-title">{schedule.title}</div>
        {(!schedule.isFriendSchedule || schedule.visibility === 'public') && (
          <>
            <div className="text-xs text-white">
              {new Date(schedule.start_time).toLocaleTimeString()} - {new Date(schedule.end_time).toLocaleTimeString()}
            </div>
            {schedule.description && (
              <div className="text-xs text-white">{schedule.description}</div>
            )}
            <div className="text-xs text-white">{schedule.owner_name}</div>
          </>
        )}
      </div>
    );
  };

  const renderCalendar = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - currentDate.getDay() + i);
      return date;
    });

    const timeSlots = Array.from({ length: 24 }, (_, i) =>
      `${String(i).padStart(2, '0')}:00`
    );

    return (
      <div className="calendar-container h-[calc(100vh-180px)] bg-[#181825] rounded-lg border border-[#45475a]">
        <div className="calendar-scroll overflow-auto h-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#302d41]">
                <th className="w-20 p-2 border-r border-[#45475a] sticky left-0 z-20 bg-[#302d41]">
                  Time
                </th>
                {weekDates.map((date, index) => (
                  <th key={index} className="p-2 min-w-[150px] border-r border-[#45475a]">
                    <div className="font-bold text-[#cdd6f4]">{days[date.getDay()]}</div>
                    <div className="text-sm text-[#a6adc8]">{date.toLocaleDateString()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-b border-[#45475a]">
                  <td className="p-2 border-r border-[#45475a] text-center sticky left-0 z-10 bg-[#302d41]">
                    {time}
                  </td>
                  {weekDates.map((date, index) => (
                    <td
                      key={index}
                      className="p-2 border-r border-[#45475a] relative h-16 bg-[#1e1e2e] hover:bg-[#313244] cursor-pointer"
                      onClick={() => handleCellClick(date, parseInt(time))}
                    >
                      {allSchedules
                        .filter(
                          (schedule) =>
                            // Show own schedules (including hidden)
                            (!schedule.isFriendSchedule) ||
                            // Show friend schedules (excluding hidden)
                            (schedule.isFriendSchedule && selectedFriends.includes(schedule.friendId))
                        )
                        .filter(
                          (schedule) =>
                            new Date(schedule.start_time).toDateString() === date.toDateString() &&
                            new Date(schedule.start_time).getHours() <= parseInt(time) &&
                            new Date(schedule.end_time).getHours() > parseInt(time)
                        )
                        .map((schedule, idx) => renderScheduleBlock(schedule, time))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-[#1e1e2e] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-[#cdd6f4]">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h1>
        <div className="flex space-x-4">
          <button onClick={handlePrevious} className="bg-[#89b4fa] text-white px-4 py-2 rounded">
            Previous
          </button>
          <button onClick={handleNext} className="bg-[#89b4fa] text-white px-4 py-2 rounded">
            Next
          </button>
        </div>
      </div>
      
      <div className="flex gap-4">
        {/* Friends List */}
        <div className="w-64 bg-[#302d41] p-4 rounded-lg h-[calc(100vh-180px)] overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Friends</h2>
          <div className="space-y-2">
            {friends.map((friend, index) => (
              <label 
                key={friend.id} 
                className="flex items-center space-x-2 text-[#cdd6f4] friends-list-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend.id)}
                  onChange={(e) => handleFriendToggle(friend.id, e.target.checked)}
                  className="form-checkbox h-4 w-4 text-[#89b4fa]"
                />
                <span>{friend.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1">
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
}

export default Home;
