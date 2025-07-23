import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploaded = await uploadFile(file);

    setUploadPhoto(file);
    setData(prev => ({
      ...prev,
      profile_pic: uploaded?.url || ""
    }));
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
    setData(prev => ({
      ...prev,
      profile_pic: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}api/register`;

    const finalData = { ...data };
    if (!finalData.profile_pic) {
      finalData.profile_pic = `https://ui-avatars.com/api/?name=${encodeURIComponent(finalData.name || "User")}`;
    }

    console.log("Submitting:", finalData);

    try {
      const response = await axios.post(URL, finalData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      toast.success(response.data.message || "Registered successfully!");

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        });
        setUploadPhoto(null);
        navigate('/email');
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='mt-8 px-4'>
      <div className='bg-white w-full max-w-md mx-auto rounded-xl p-6 shadow-md transition'>
        <h3 className='text-xl font-bold text-center text-slate-800'>Welcome to Chat App!</h3>

        <form className='grid gap-5 mt-6' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name' className='text-sm font-medium text-slate-700'>Name:</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              className='bg-slate-100 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='text-sm font-medium text-slate-700'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-slate-100 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password' className='text-sm font-medium text-slate-700'>Password:</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='profile_pic' className='text-sm font-medium text-slate-700'>Photo:</label>
            <label htmlFor='profile_pic'>
              <div className='h-14 bg-slate-100 flex justify-between items-center px-3 rounded border hover:border-primary cursor-pointer transition'>
                <p className='text-sm truncate'>
                  {uploadPhoto?.name ? uploadPhoto.name : "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className='text-lg ml-2 text-slate-500 hover:text-red-600'
                    onClick={handleClearUploadPhoto}
                    type='button'
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='hidden'
              onChange={handleUploadPhoto}
              accept='image/*'
            />
          </div>

          <button
            type='submit'
            className='bg-primary text-lg px-4 py-2 rounded font-bold text-white tracking-wide transition hover:bg-secondary hover:scale-[1.02]'
          >
            Register
          </button>
        </form>

        <p className='mt-5 text-center text-sm text-slate-600'>
          Already have an account?{' '}
          <Link to={"/email"} className='text-primary hover:underline font-medium'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
