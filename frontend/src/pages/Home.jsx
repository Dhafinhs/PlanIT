import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from '../components/Notification'; // Import Notification component

function Home() {
  const [userSchedules, setUserSchedules] = useState([]);
  const [friendSchedules, setFriendSchedules] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allSchedules, setAllSchedules] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]); // Track pending friend requests
  const [notification, setNotification] = useState(''); // Notification state
  const [friendSearchQuery, setFriendSearchQuery] = useState(''); // Search query for friends
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    visibility: 'public',
  });
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [groups, setGroups] = useState([]); // State untuk grup
  const [selectedGroups, setSelectedGroups] = useState([]); // State untuk grup yang dipilih
  const [scheduleType, setScheduleType] = useState('personal'); // State untuk tipe jadwal
  const [selectedGroup, setSelectedGroup] = useState(''); // State untuk grup yang dipilih
  const [groupMembers, setGroupMembers] = useState({}); // State untuk menyimpan anggota grup yang di-load
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);

    const fetchUserSchedules = async () => {
      try {
        const res = await axios.get('https://planitbackend-production.up.railway.app/api/schedules', {
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
        const res = await axios.get('https://planitbackend-production.up.railway.app/api/friends', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(res.data);
      } catch (err) {
        console.error('Fetch friends gagal:', err);
      }
    };

    const fetchPendingRequests = async () => {
      try {
        const res = await axios.get('https://planitbackend-production.up.railway.app/api/friends/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingRequests(res.data);
        if (res.data.length > 0) {
          setNotification(`You have ${res.data.length} pending friend request(s).`);
        }
      } catch (err) {
        console.error('Fetch pending requests failed:', err);
      }
    };

    const fetchGroups = async () => {
      try {
        const res = await axios.get('https://planitbackend-production.up.railway.app/api/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      }
    };

    fetchUserSchedules();
    fetchFriends();
    fetchPendingRequests();
    fetchGroups();
  }, []);

  const handleFriendSearch = (e) => {
    setFriendSearchQuery(e.target.value);
  };

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
        const res = await axios.get(`https://planitbackend-production.up.railway.app/api/schedules/${friendId}`, {
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

  const handleGroupToggle = async (groupId, checked) => {
    if (checked) {
      try {
        const res = await axios.get(`https://planitbackend-production.up.railway.app/api/groups/${groupId}/schedule`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const groupSchedules = res.data.map(schedule => ({
          ...schedule,
          isGroupSchedule: true,
          groupId: groupId,
          isMemberSchedule: schedule.owner_id !== user.id, // Tandai jika jadwal milik anggota grup
        }));
        setAllSchedules(prev => [...prev, ...groupSchedules]);
        setSelectedGroups(prev => [...prev, groupId]);
      } catch (err) {
        console.error('Failed to fetch group schedules:', err);
      }
    } else {
      setAllSchedules(prev => prev.filter(schedule =>
        !schedule.isGroupSchedule || schedule.groupId !== groupId
      ));
      setSelectedGroups(prev => prev.filter(id => id !== groupId));
    }
  };

  const handleCellClick = (date, hour) => {
    const clickedDate = new Date(date);
    clickedDate.setHours(hour, 0, 0, 0);

    const scheduleToEdit = allSchedules.find(
      (schedule) =>
        new Date(schedule.start_time).toISOString() === clickedDate.toISOString()
    );

    if (scheduleToEdit) {
      // Edit existing schedule
      setForm({
        title: scheduleToEdit.title || '',
        description: scheduleToEdit.description || '',
        start_time: scheduleToEdit.start_time.slice(0, 16),
        end_time: scheduleToEdit.end_time.slice(0, 16),
        visibility: scheduleToEdit.visibility || 'public',
        id: scheduleToEdit.id, // Include ID for editing
      });
    } else {
      // Add new schedule
      const endTime = new Date(clickedDate);
      endTime.setHours(clickedDate.getHours() + 1); // Default duration is 1 hour

      setForm({
        title: '',
        description: '',
        start_time: clickedDate.toISOString().slice(0, 16),
        end_time: endTime.toISOString().slice(0, 16),
        visibility: 'public',
      });
    }

    setShowAddSchedule(true);
  };

  const renderLegend = () => (
    <div className="flex justify-center space-x-4 mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-[#89b4fa] border-t-4 border-[#74c7ec]"></div>
        <span className="text-[#cdd6f4] text-sm">Public</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-[#f38ba8] border-t-4 border-[#eba0ac]"></div>
        <span className="text-[#cdd6f4] text-sm">Private</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-[#a6adc8] border-t-4 border-[#6c7086]"></div>
        <span className="text-[#cdd6f4] text-sm">Hidden</span>
      </div>
    </div>
  );

  const renderScheduleBlock = (schedule, time) => {
    const startHour = new Date(schedule.start_time).getHours();
    const endHour = new Date(schedule.end_time).getHours();
    const duration = endHour - startHour;

    const getScheduleClass = () => {
      if (!schedule.isFriendSchedule && !schedule.isGroupSchedule) {
        return 'border-t-4 border-[#f9e2af] bg-[#f9e2af]'; // Distinct color for user schedules
      }
      switch (schedule.visibility) {
        case 'public':
          return 'border-t-4 border-[#74c7ec] bg-[#89b4fa]';
        case 'private':
          return 'border-t-4 border-[#eba0ac] bg-[#f38ba8]';
        case 'hidden':
          return 'border-t-4 border-[#6c7086] bg-[#a6adc8]';
        default:
          return '';
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
        {schedule.visibility !== 'hidden' && (
          <>
            <div className="text-xs text-white">
              {new Date(schedule.start_time).toLocaleTimeString()} - {new Date(schedule.end_time).toLocaleTimeString()}
            </div>
            {schedule.description && (
              <div className="text-xs text-white">{schedule.description}</div>
            )}
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

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (scheduleType === 'personal') {
        if (form.id) {
          // Update existing personal schedule
          await axios.put(
            `http://localhost:5000/api/schedules/${form.id}`,
            form,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          // Add new personal schedule
          await axios.post(
            'http://localhost:5000/api/schedules',
            form,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } else if (scheduleType === 'group' && selectedGroup) {
        // Add new group schedule
        await axios.post(
          `http://localhost:5000/api/groups/${selectedGroup}/schedule`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      alert('Schedule saved successfully!');
      setShowAddSchedule(false);
      // Refresh schedules
      const res = await axios.get('http://localhost:5000/api/schedules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllSchedules(res.data);
    } catch (err) {
      alert('Failed to save schedule: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCreateGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/groups',
        { name: groupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const groupId = res.data.id;

      // Add selected members to the group
      for (const memberId of selectedGroupMembers) {
        await axios.post(
          `http://localhost:5000/api/groups/${groupId}/members`,
          { userId: memberId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert('Group created successfully!');
      setShowCreateGroup(false);
      setGroupName('');
      setSelectedGroupMembers([]);
    } catch (err) {
      console.error(err);
      alert('Failed to create group: ' + err.response?.data?.error);
    }
  };

  const toggleGroupMember = (friendId) => {
    setSelectedGroupMembers((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleGroupClick = async (groupId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/${groupId}/schedule`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert(`Schedules for group ${groupId}: ${JSON.stringify(res.data, null, 2)}`);
    } catch (err) {
      console.error('Failed to fetch group schedules:', err);
    }
  };

  const toggleGroupMembers = async (groupId) => {
    if (groupMembers[groupId]) {
      // Jika anggota grup sudah di-load, hapus dari state untuk menyembunyikan
      setGroupMembers((prev) => {
        const updated = { ...prev };
        delete updated[groupId];
        return updated;
      });
    } else {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setGroupMembers((prev) => ({
          ...prev,
          [groupId]: res.data.members,
        }));
      } catch (err) {
        console.error('Failed to fetch group members:', err);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#1e1e2e] flex flex-col">
      {notification && <Notification message={notification} onClose={() => setNotification('')} />}

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
      
      {/* Legend */}
      {renderLegend()}

      <div className="flex gap-4">
        {/* Friends List */}
        <div className="w-64 bg-[#302d41] p-4 rounded-lg h-[calc(100vh-180px)] overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Friends</h2>
          <input
            type="text"
            placeholder="Search friends..."
            value={friendSearchQuery}
            onChange={handleFriendSearch}
            className="w-full p-2 mb-4 bg-[#1e1e2e] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] 
                     border border-[#45475a] focus:border-[#89b4fa] transition-all duration-300
                     hover:border-[#89b4fa]"
          />
          <div className="space-y-2">
            {friends
              .filter(friend => 
                friend.name.toLowerCase().includes(friendSearchQuery.toLowerCase())
              )
              .map((friend, index) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between bg-[#1e1e2e] p-2 rounded-lg hover:bg-[#313244] transition"
                >
                  <label className="flex items-center space-x-2 text-[#cdd6f4]">
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.id)}
                      onChange={(e) => handleFriendToggle(friend.id, e.target.checked)}
                      className="form-checkbox h-4 w-4 text-[#89b4fa]"
                    />
                    <span>{friend.name}</span>
                  </label>
                </div>
              ))}
          </div>
          <button
            onClick={() => navigate('/groups/create')}
            className="mt-4 w-full bg-[#89b4fa] text-white py-2 rounded"
          >
            Create Group
          </button>
        </div>

        {/* Groups List */}
        <div className="w-64 bg-[#302d41] p-4 rounded-lg h-[calc(100vh-180px)] overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Groups</h2>
          <div className="space-y-2">
            {groups.map((group) => (
              <div key={group.id} className="bg-[#1e1e2e] p-2 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-[#cdd6f4]">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={(e) => handleGroupToggle(group.id, e.target.checked)}
                      className="form-checkbox h-4 w-4 text-[#89b4fa]"
                    />
                    <span>{group.name}</span>
                  </label>
                  <button
                    onClick={() => toggleGroupMembers(group.id)}
                    className="text-[#89b4fa] hover:underline"
                  >
                    {groupMembers[group.id] ? '-' : '+'}
                  </button>
                </div>
                {groupMembers[group.id] && (
                  <ul className="mt-2 space-y-1 pl-4">
                    {groupMembers[group.id].map((member) => (
                      <li key={member.id} className="text-[#a6adc8]">
                        {member.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1">
          {renderCalendar()}
        </div>
      </div>

      {/* Add Schedule Card */}
      {showAddSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#302d41] p-6 rounded shadow-md w-96 relative">
            <button
              onClick={() => setShowAddSchedule(false)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Add Schedule</h2>
            <form onSubmit={handleFormSubmit}>
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
                onChange={handleFormChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full border p-2 mb-3"
                value={form.description}
                onChange={handleFormChange}
              />
              <input
                type="datetime-local"
                name="start_time"
                className="w-full border p-2 mb-3"
                value={form.start_time}
                onChange={handleFormChange}
              />
              <input
                type="datetime-local"
                name="end_time"
                className="w-full border p-2 mb-3"
                value={form.end_time}
                onChange={handleFormChange}
              />
              {scheduleType === 'personal' && (
                <select
                  name="visibility"
                  className="w-full border p-2 mb-3"
                  value={form.visibility}
                  onChange={handleFormChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="hidden">Hidden</option>
                </select>
              )}
              <button className="w-full py-2 bg-[#89b4fa] text-white rounded">
                Save Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#302d41] p-6 rounded shadow-md w-96 relative">
            <button
              onClick={() => setShowCreateGroup(false)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Create Group</h2>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 mb-4 bg-[#1e1e2e] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] 
                       border border-[#45475a] focus:border-[#89b4fa] transition-all duration-300
                       hover:border-[#89b4fa]"
            />
            <button
              onClick={handleCreateGroup}
              className="w-full py-2 bg-[#89b4fa] text-white rounded"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
