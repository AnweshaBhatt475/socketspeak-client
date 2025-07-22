import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const nav = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/group`, {
        withCredentials: true
      });
      setGroups(res.data.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // ✅ FIXED: Create group with members and createdBy
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?._id;

    // Temporary: include creator + mock second user
    const members = [userId, "664f2db12ea84d99d0b58abc"]; // Replace second ID later with real member selection

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/group/create`,
        {
          name: groupName,
          members,
          createdBy: userId,
          profile_pic: "", // optional
        },
        { withCredentials: true }
      );
      setShowCreateModal(false);
      setGroupName('');
      fetchGroups(); // Refresh the list
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Groups</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
        >
          + Create Group
        </button>
      </div>

      <ul>
        {groups.map(g => (
          <li
            key={g._id}
            onClick={() => nav(`/group/${g._id}`)}
            className="cursor-pointer p-2 hover:bg-slate-100 border rounded mb-2"
          >
            {g.name} ({g.members.length})
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Enter group name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1 border rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
