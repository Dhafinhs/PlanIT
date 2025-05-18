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
  
  // Friend related endpoints
  searchUsers: (query) => axios.get(`${API_URL}/users/search`, { params: { query } }),
  sendFriendRequest: (friendId) => axios.post(`${API_URL}/friends/request`, { friend_id: friendId }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }),
  getFriendSchedules: (friendId) => axios.get(`${API_URL}/schedules/${friendId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }),
};

export default api;
