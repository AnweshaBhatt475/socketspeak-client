// src/components/CreateGroup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CreateGroup() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreate = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/group`,
        { name },
        { withCredentials: true }
      );
      toast.success(res.data.message || 'Group created');
      navigate(`/group/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating group');
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <form onSubmit={handleCreate} className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Create Group</h3>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded mb-4"
          placeholder="Group Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button className="w-full bg-primary py-2 text-white rounded hover:bg-secondary">Create</button>
      </form>
    </div>
  );
}
