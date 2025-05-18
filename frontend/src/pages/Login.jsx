import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/schedules');
    } catch (err) {
      alert('Login gagal: ' + err.response?.data?.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e2e]">
      <form onSubmit={handleSubmit} className="bg-[#302d41] p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-[#cdd6f4]">Login</h2>
        <input type="text" name="username" placeholder="Username"
          className="w-full border p-2 mb-3" value={form.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password"
          className="w-full border p-2 mb-3" value={form.password} onChange={handleChange} />
        <button className="w-full py-2">Login</button>
      </form>
    </div>
  );
}

export default Login;
