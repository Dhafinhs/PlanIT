import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import Notification from '../components/Notification';

function Friends() {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/friends', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFriends(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch friends');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/friends/pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPendingRequests(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch requests');
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);

    if (e.target.value.length >= 2) {
      setLoading(true);
      try {
        const res = await api.searchUsers(e.target.value);
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
        showNotification('Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await api.sendFriendRequest(friendId);
      showNotification('Friend request sent!');
      // Update UI immediately
      setSearchResults(prev => 
        prev.map(user => 
          user.id === friendId 
            ? { ...user, requestSent: true }
            : user
        )
      );
    } catch (err) {
      console.error(err);
      showNotification('Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (friendId) => {
    try {
      await api.acceptFriendRequest(friendId);
      showNotification('Friend request accepted!');
      fetchPendingRequests();
      fetchFriends();
    } catch (err) {
      console.error(err);
      showNotification('Failed to accept request');
    }
  };

  const handleRejectRequest = async (friendId) => {
    try {
      await api.rejectFriendRequest(friendId);
      showNotification('Friend request rejected');
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
      showNotification('Failed to reject request');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="min-h-screen p-6 bg-[#1e1e2e] animate-fadeIn">
      {notification && <Notification message={notification} onClose={() => setNotification('')} />}
      
      {/* Friend Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="mb-8 animate-slideDown">
          <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Friend Requests</h2>
          <div className="grid gap-4">
            {pendingRequests.map((request, index) => (
              <div
                key={request.id}
                className="bg-[#302d41] p-4 rounded-lg flex justify-between items-center
                         transform hover:scale-102 transition-all duration-300
                         animate-slideIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <h3 className="text-[#cdd6f4] font-bold">{request.name}</h3>
                  <p className="text-[#a6adc8]">@{request.username}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="px-4 py-2 bg-[#a6e3a1] text-white rounded hover:bg-[#94e2d5]
                             transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="px-4 py-2 bg-[#f38ba8] text-white rounded hover:bg-[#eba0ac]
                             transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="mb-8 animate-slideDown">
        <h1 className="text-2xl font-bold mb-4 text-[#cdd6f4]">Find Friends</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-4 bg-[#302d41] rounded-lg text-[#cdd6f4] placeholder-[#6c7086] 
                     border border-[#45475a] focus:border-[#89b4fa] transition-all duration-300
                     hover:border-[#89b4fa]"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Search Results</h2>
          <div className="grid gap-4">
            {searchResults.map((user, index) => (
              <div
                key={user.id}
                className="bg-[#302d41] p-4 rounded-lg flex justify-between items-center
                         transform hover:scale-102 transition-all duration-300
                         animate-slideIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <h3 className="text-[#cdd6f4] font-bold">{user.name}</h3>
                  <p className="text-[#a6adc8]">@{user.username}</p>
                </div>
                {!friends.find(f => f.id === user.id) && !user.requestSent ? (
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    className="px-4 py-2 bg-[#89b4fa] text-white rounded hover:bg-[#74c7ec]
                             transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Add Friend
                  </button>
                ) : user.requestSent ? (
                  <span className="text-[#a6adc8] italic">Request Sent</span>
                ) : (
                  <span className="text-[#a6e3a1]">Already Friends</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Friends */}
      <div className="animate-slideUp">
        <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Your Friends</h2>
        <div className="grid gap-4">
          {friends.map((friend, index) => (
            <div
              key={friend.id}
              className="bg-[#302d41] p-4 rounded-lg flex justify-between items-center
                       transform hover:scale-102 transition-all duration-300
                       animate-slideIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div>
                <h3 className="text-[#cdd6f4] font-bold">{friend.name}</h3>
                <p className="text-[#a6adc8]">@{friend.username}</p>
              </div>
              <button
                onClick={() => navigate(`/friends/${friend.id}/schedules`)}
                className="px-4 py-2 bg-[#89b4fa] text-white rounded hover:bg-[#74c7ec]
                         transform hover:-translate-y-1 transition-all duration-300"
              >
                View Schedules
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;
