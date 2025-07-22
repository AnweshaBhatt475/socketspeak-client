import React, { useState } from 'react';
import { PiUserCircle } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CheckEmailPage = () => {
  const [data, setData] = useState({ email: "" });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message || "Email verified!");

      if (response.data.success) {
        setData({ email: "" });
        navigate('/password', { state: response.data.data });
      }
    } catch (error) {
      console.error("Email check error:", error);
      toast.error(error?.response?.data?.message || "Failed to verify email");
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 px-4'>
      <div className='bg-white w-full max-w-md rounded-xl shadow-md p-6'>
        {/* Icon */}
        <div className='w-fit mx-auto mb-3 text-primary'>
          <PiUserCircle size={80} />
        </div>

        {/* Title */}
        <h3 className='text-2xl font-bold text-center text-slate-700'>
          Welcome to Chat App!
        </h3>
        <p className='text-center text-sm text-slate-500 mt-1'>Please enter your email to continue</p>

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
              placeholder='example@email.com'
              className='bg-slate-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type='submit'
            className='bg-primary text-white font-semibold py-2 rounded hover:bg-secondary transition'
          >
            Let’s Go
          </button>
        </form>

        {/* Register Link */}
        <p className='text-center text-sm mt-4'>
          New User?{' '}
          <Link
            to='/register'
            className='text-primary font-semibold hover:underline'
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
