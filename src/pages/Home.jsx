import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';
import io from 'socket.io-client';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchUserDetails = async () => {
    try {
      const response = await axios({
        url: `${apiUrl}/api/user-details`,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }

      console.log('Current user details:', response.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error?.response?.status === 401) {
        navigate('/email');
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn("No auth token found");
      return;
    }

    const socketConnection = io(apiUrl, {
      auth: { token },
      withCredentials: true,
    });

    socketConnection.on('connect', () => {
      console.log("🔌 Socket connected:", socketConnection.id);
    });

    socketConnection.on('onlineUser', (data) => {
      console.log('🟢 Online users:', data);
      dispatch(setOnlineUser(data));
    });

    socketConnection.on('connect_error', (err) => {
      console.error("🚨 Socket connection error:", err.message);
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
      console.log("🔌 Socket disconnected");
    };
  }, []);

  const basePath = location.pathname === '/';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] h-screen max-h-screen bg-slate-50 transition-all">
      {/* Sidebar Section */}
      <section className={`bg-white ${!basePath && 'hidden'} lg:block border-r border-slate-200`}>
        <Sidebar />
      </section>

      {/* Message Outlet Section */}
      <section className={`w-full h-full ${basePath && 'hidden'}`}>
        <Outlet />
      </section>

      {/* Landing Logo Section */}
      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? 'hidden' : 'lg:flex'} text-center`}>
        <img src={logo} alt="Logo" className="w-[200px] lg:w-[250px] transition duration-300" />
        <p className="text-lg mt-4 text-slate-500 tracking-wide">
          Select a user to start chatting
        </p>
      </div>
    </div>
  );
};

export default Home;