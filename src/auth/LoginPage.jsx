import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    toast.error('Email dan password harus diisi');
    return;
  }

  try {
    const res = await fetch('https://spp-payment-api-rayyan5038480-05ynou93.leapcell.dev/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      const token = data.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');

      const profileRes = await fetch('https://spp-payment-api-rayyan5038480-05ynou93.leapcell.dev/api/v1/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = await profileRes.json();

      if (!profileRes.ok || !profileData.data || !profileData.data.role) {
        throw new Error('Gagal mendapatkan data role');
      }

      const role = profileData.data.role;
      const nama = profileData.data.nama_lengkap;

      localStorage.setItem('role', role);
      localStorage.setItem('nama', nama);

      // ✅ Tampilkan toast berhasil login
      toast.success(`Login berhasil !!!`, {
        position: 'top-right',
        autoClose: 1500,
      });

      // Redirect setelah 1 detik agar toast terlihat
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'bendahara') {
          navigate('/bendahara/dashboard');
        } else if (role === 'siswa') {
          navigate('/pembayaran');
        } else {
          toast.error('Role tidak dikenal');
          navigate('/login');
        }
      }, 1000);
    } else {
      toast.error(data.message || 'Login gagal, periksa email/password');
    }
  } catch (err) {
    console.error(err);
    toast.error('Terjadi kesalahan saat login');
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login SDS Taman Harapan</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            Login
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default LoginPage;
