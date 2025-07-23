import React, { useEffect } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from './redux/userSlice';
import socket from './socket'; // ✅ import your socket instance

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch(setToken(token));
      dispatch(setUser(JSON.parse(user)));

      // ✅ Set token on socket and connect
      socket.auth = { token };
      socket.connect();
    }
  }, []);

  return (
    <>
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
