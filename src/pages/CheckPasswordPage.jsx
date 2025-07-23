// CheckPasswordPage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { setToken, setUser } from "../redux/userSlice";
import socket from "../socket";

const CheckPasswordPage = () => {
  const [data, setData] = useState({ password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fallbackUser = location?.state?.user || JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-password`,
        {
          email: fallbackUser?.email,
          password: data.password,
        }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // Store in Redux
        dispatch(setToken(token));
        dispatch(setUser(user));

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Connect socket with token
        socket.auth = { token };
        socket.connect();

        setData({ password: "" });
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data ||
          error.message
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Enter Password</h2>

        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded mb-4"
          required
        />

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CheckPasswordPage;
