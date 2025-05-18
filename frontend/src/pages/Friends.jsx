import { useEffect, useState } from 'react';
import api from '../services/api';
import Notification from '../components/Notification';

function Friends() {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchUsersAndFriends = async () => {
      setLoading(true);
      try {
        const [usersRes, friendsRes] = await Promise.all([
          api.getData(), // Assuming this fetches all users
          api.getFriends(),
        ]);
        setUsers(usersRes.data);
        setFriends(friendsRes.data.map(friend => friend.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndFriends();
  }, []);

  const handleAddFriend = async (friendId) => {
    try {
      await api.sendFriendRequest(friendId);
      setFriends([...friends, friendId]);
      setNotification('Friend request sent!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {notification && <Notification message={notification} onClose={() => setNotification('')} />}
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      {loading && <div className="spinner mx-auto"></div>}
      {!loading && users.length === 0 && (
        <p className="empty-state">No users available.</p>
      )}
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
            <span>{user.name}</span>
            {friends.includes(user.id) ? (
              <span className="text-green-600 font-bold">Friend</span>
            ) : (
              <button
                onClick={() => handleAddFriend(user.id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Friend
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;
