import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await axios.get('/api/groups', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectGroup = async (groupId) => {
    try {
      console.log(`Fetching details for group ID: ${groupId}`); // Debug log
      const res = await axios.get(`/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSelectedGroup(res.data.group);
      setMembers(res.data.members);

      // Fetch schedules for the selected group
      const scheduleRes = await axios.get(`/api/groups/${groupId}/schedule`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSchedules(scheduleRes.data);
    } catch (err) {
      console.error(`Failed to fetch details for group ID ${groupId}:`, err); // Debug log
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      console.log(`Attempting to delete group ID: ${groupId}`); // Debug log
      await axios.delete(`/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      setSelectedGroup(null);
      alert('Group deleted successfully!');
    } catch (err) {
      console.error(`Failed to delete group ID ${groupId}:`, err); // Debug log
      alert('Failed to delete group.');
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-[#1e1e2e]">
      <h1 className="text-3xl font-bold mb-6 text-[#cdd6f4]">Groups</h1>

      {/* Navigate to Create Group */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/groups/create')}
          className="w-full py-2 bg-[#89b4fa] text-white rounded"
        >
          Create Group
        </button>
      </div>

      {/* Group List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Your Groups</h2>
        <ul className="space-y-2">
          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => handleSelectGroup(group.id)}
              className="bg-[#302d41] p-4 rounded-lg hover:bg-[#313244] transition cursor-pointer"
            >
              {group.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Group Details */}
      {selectedGroup && (
        <div className="bg-[#302d41] p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#cdd6f4]">Group: {selectedGroup.name}</h2>
          <button
            onClick={() => handleDeleteGroup(selectedGroup.id)}
            className="mb-4 py-2 px-4 bg-[#f38ba8] text-white rounded hover:bg-[#eba0ac] transition"
          >
            Delete Group
          </button>
          <h3 className="text-xl font-bold mb-4 text-[#cdd6f4]">Members</h3>
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id} className="text-[#cdd6f4]">
                {member.name}
              </li>
            ))}
          </ul>

          {/* Group Schedules */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-[#cdd6f4]">Group Schedules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-[#1e1e2e] p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-[#cdd6f4]">{schedule.title}</h4>
                  <p className="text-sm text-[#a6adc8]">{schedule.description}</p>
                  <p className="text-sm text-[#a6adc8]">
                    {new Date(schedule.start_time).toLocaleString()} -{' '}
                    {new Date(schedule.end_time).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
