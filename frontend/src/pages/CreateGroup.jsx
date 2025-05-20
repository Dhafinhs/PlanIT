import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://planitbackend-production.up.railway.app/api/friends', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(res.data);
        setFilteredFriends(res.data); // Initialize filtered friends
      } catch (err) {
        console.error(err);
      }
    };

    fetchFriends();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredFriends(
      friends.filter((friend) =>
        friend.name.toLowerCase().includes(query)
      )
    );
  };

  const toggleMemberSelection = (friendId) => {
    setSelectedMembers((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreateGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://planitbackend-production.up.railway.app/api/groups',
        { name: groupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const groupId = res.data.id;

      for (const memberId of selectedMembers) {
        try {
          await axios.post(
            `https://planitbackend-production.up.railway.app/api/groups/${groupId}/members`,
            { userId: memberId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error(`Failed to add member ${memberId}:`, err.message);
        }
      }

      alert('Group created successfully!');
      navigate('/groups');
    } catch (err) {
      console.error(err);
      alert('Failed to create group: ' + err.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#1e1e2e] flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-[#cdd6f4]">Create Group</h1>
      <div className="bg-[#302d41] p-6 rounded shadow-md w-full max-w-lg">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 mb-4 bg-[#1e1e2e] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] 
                   border border-[#45475a] focus:border-[#89b4fa] transition-all duration-300
                   hover:border-[#89b4fa]"
        />
        <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Add Members</h2>
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 mb-4 bg-[#1e1e2e] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] 
                   border border-[#45475a] focus:border-[#89b4fa] transition-all duration-300
                   hover:border-[#89b4fa]"
        />
        <div className="space-y-2 max-h-40 overflow-auto">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between bg-[#1e1e2e] p-2 rounded-lg hover:bg-[#313244] transition"
            >
              <span className="text-[#cdd6f4]">{friend.name}</span>
              <button
                onClick={() => toggleMemberSelection(friend.id)}
                className={`px-2 py-1 text-sm rounded ${
                  selectedMembers.includes(friend.id)
                    ? 'bg-[#f38ba8] text-white'
                    : 'bg-[#89b4fa] text-white'
                }`}
              >
                {selectedMembers.includes(friend.id) ? 'Remove' : 'Add'}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleCreateGroup}
          className="w-full py-2 mt-4 bg-[#89b4fa] text-white rounded"
        >
          Create Group
        </button>
      </div>
    </div>
  );
}

export default CreateGroup;
