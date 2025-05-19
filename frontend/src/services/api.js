import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  // User related endpoints
  login: (credentials) => axios.post(`${API_URL}/auth/login`, credentials),
  register: (userData) => axios.post(`${API_URL}/auth/register`, userData),
  
  // Data related endpoints
  getData: () => axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }),
  createData: (data) => axios.post(`${API_URL}/data`, data),
  updateData: (id, data) => axios.put(`${API_URL}/data/${id}`, data),
  deleteData: (id) => axios.delete(`${API_URL}/data/${id}`),
  
  // Enhanced friend related endpoints
  searchUsers: (query) => axios.get(`${API_URL}/users/search`, {
    params: { query },
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  getFriends: () => axios.get(`${API_URL}/friends`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  getPendingRequests: () => axios.get(`${API_URL}/friends/pending`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  sendFriendRequest: (friendId) => axios.post(`${API_URL}/friends/request`, 
    { friend_id: friendId },
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  ),
  
  acceptFriendRequest: (friendId) => axios.post(`${API_URL}/friends/accept`,
    { friend_id: friendId },
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  ),
  
  rejectFriendRequest: (friendId) => axios.post(`${API_URL}/friends/reject`,
    { friend_id: friendId },
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  ),
  
  getFriendSchedules: (friendId) => axios.get(`${API_URL}/schedules/${friendId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }),
  
  // Group related endpoints
  createGroup: (groupName) =>
    axios.post(`${API_URL}/groups`, groupName, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),
  addGroupMember: (groupId, userId) =>
    axios.post(`${API_URL}/groups/${groupId}/members`, { userId }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),
};

export default api;
