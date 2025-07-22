import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({ password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user); // ✅ Use user from Redux

  // Redirect if required user data is not in location (during first visit)
  useEffect(() => {
    if (!location?.state?._id || !location?.state?.name) {
      navigate('/email');
    }
  }, [location, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;

    try {
      const response = await axios.post(
        URL,
        {
          userId: location?.state?._id,
          password: data.password
        },
        { withCredentials: true }
      );

      toast.success(response.data.message || "Login successful");

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        dispatch(setUser(response?.data?.user));
        localStorage.setItem('token', response?.data?.token);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));

        setData({ password: "" });
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='mt-5 px-4'>
      <div className='bg-white w-full max-w-md rounded-xl overflow-hidden p-6 mx-auto shadow-md transition-all duration-150'>
        <div className='w-fit mx-auto mb-4 flex justify-center items-center flex-col'>
          <Avatar
            width={70}
            height={70}
            name={user?.name || location?.state?.name || "User"}
            imageUrl={user?.profile_pic || location?.state?.profile_pic}
          />
          <h2 className='font-semibold text-lg mt-2 text-slate-800 text-center tracking-wide'>
            {user?.name || location?.state?.name || "User"}
          </h2>
        </div>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password' className='text-sm font-medium text-slate-700'>
              Password:
            </label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 ease-in-out'
              value={data.password}
              onChange={handleOnChange}
              required
              aria-label='Password input'
            />
          </div>

          <button
            type='submit'
            className='bg-primary text-lg px-4 py-2 rounded mt-2 font-bold text-white tracking-wide transition-transform duration-200 hover:bg-secondary hover:scale-[1.02]'
          >
            Login
          </button>
        </form>

        <p className='my-3 text-center text-sm'>
          <Link to={"/forgot-password"} className='hover:text-primary font-semibold transition duration-150'>
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
