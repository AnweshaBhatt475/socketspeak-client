import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/suggestions`, {
          withCredentials: true,
        });
        // Filter out current user
        const filteredUsers = res.data.data.filter(u => u._id !== user._id);
        setUsers(filteredUsers);
      } catch (err) {
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleCheckbox = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      return toast.error("Group name is required");
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/group`,
        {
          name: groupName,
          members: selectedUserIds, // send selected user ids
        },
        { withCredentials: true }
      );
      onGroupCreated(res.data.data);
      toast.success("Group created");
      onClose();
    } catch (err) {
      toast.error("Failed to create group");
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-md shadow-lg w-full max-w-md'>
        <h2 className='text-xl font-bold mb-4'>Create Group</h2>
        <input
          className='border border-gray-300 w-full p-2 rounded mb-4'
          placeholder='Enter group name'
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className='mb-4 max-h-48 overflow-y-auto'>
          {users.length === 0 ? (
            <p className='text-sm text-gray-500'>No users available</p>
          ) : (
            users.map((u) => (
              <label key={u._id} className='flex items-center gap-2 mb-2'>
                <input
                  type='checkbox'
                  checked={selectedUserIds.includes(u._id)}
                  onChange={() => handleCheckbox(u._id)}
                />
                <span>{u.name}</span>
              </label>
            ))
          )}
        </div>
        <div className='flex justify-end gap-2'>
          <button onClick={onClose} className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300'>
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className='bg-primary text-white px-4 py-2 rounded hover:bg-secondary'
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
