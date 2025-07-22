import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PiUserCircle } from 'react-icons/pi';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/request-reset`;
    try {
      const response = await axios.post(URL, { email });
      toast.success(response.data.message || "Reset link sent!");
      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4'>
      <div className='bg-white w-full max-w-md rounded-xl shadow-md p-6'>
        {/* Icon */}
        <div className='w-fit mx-auto mb-3 text-primary'>
          <PiUserCircle size={80} />
        </div>

        {/* Title */}
        <h2 className='text-2xl font-bold text-center text-slate-700'>Forgot Password?</h2>
        <p className='text-center text-sm text-slate-500 mt-1'>
          Enter your email and we’ll send you reset instructions.
        </p>

        {/* Form */}
        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='font-medium text-sm text-slate-600'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='you@example.com'
              className='bg-slate-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`bg-primary text-white font-semibold py-2 rounded hover:bg-secondary transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className='text-center text-sm mt-4'>
          Remember your password?{" "}
          <Link to='/login' className='text-primary font-semibold hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
