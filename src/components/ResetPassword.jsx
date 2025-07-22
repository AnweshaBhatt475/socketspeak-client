import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PiLockKeyBold } from 'react-icons/pi';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // You can pass token via location.state or query string
  const token = location?.state?.token || new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`;
      const response = await axios.post(URL, {
        token,
        password
      });

      toast.success(response.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4'>
      <div className='bg-white w-full max-w-md rounded-xl shadow-md p-6'>
        <div className='w-fit mx-auto mb-3 text-primary'>
          <PiLockKeyBold size={70} />
        </div>

        <h2 className='text-2xl font-bold text-center text-slate-700'>Set New Password</h2>
        <p className='text-center text-sm text-slate-500 mt-1'>
          Enter and confirm your new password.
        </p>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password' className='text-sm text-slate-600 font-medium'>
              New Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='********'
              className='bg-slate-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='confirmPassword' className='text-sm text-slate-600 font-medium'>
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              placeholder='********'
              className='bg-slate-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`bg-primary text-white font-semibold py-2 rounded hover:bg-secondary transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
