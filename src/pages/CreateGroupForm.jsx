import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import uploadFile from '../helpers/uploadFile';
import Avatar from '../components/Avatar';

const CreateGroupForm = () => {
  const user = useSelector(state => state.user);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.post(`${apiUrl}/api/search-user`, { search: "" });
      setMembers(res.data.data);
    };
    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      return toast.error("Group must have a name and at least 2 members");
    }

    const payload = {
      name: groupName,
      createdBy: user._id,
      members: [...selectedUsers, user._id],
      profile_pic: photo
    };

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/api/group/create`, payload);
      toast.success("Group created!");
      setGroupName("");
      setSelectedUsers([]);
      setPhoto("");
      console.log("Group:", res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    const uploaded = await uploadFile(file);
    setPhoto(uploaded.url);
  };

  return (
    <div className='max-w-md mx-auto mt-8 bg-white rounded-xl p-6 shadow-md'>
      <h2 className='text-xl font-bold text-center mb-4'>Create New Group</h2>

      <input
        type="text"
        placeholder="Group Name"
        className="w-full mb-4 px-3 py-2 rounded border bg-slate-100 focus:outline-primary"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <label className='block mb-2 font-medium'>Select Members:</label>
      <div className='h-32 overflow-y-auto border rounded p-2 mb-4 bg-slate-50 scrollbar'>
        {members.map(u => (
          <div key={u._id} className='flex items-center gap-2 mb-2'>
            <input
              type="checkbox"
              checked={selectedUsers.includes(u._id)}
              onChange={() =>
                setSelectedUsers(prev =>
                  prev.includes(u._id)
                    ? prev.filter(id => id !== u._id)
                    : [...prev, u._id]
                )
              }
            />
            <Avatar imageUrl={u.profile_pic} name={u.name} width={30} height={30} />
            <span className='text-sm'>{u.name}</span>
          </div>
        ))}
      </div>

      <label className='block mb-2 font-medium'>Upload Group Photo:</label>
      <input
        type='file'
        accept='image/*'
        onChange={handlePhotoUpload}
        className='mb-4'
      />

      <button
        onClick={handleCreateGroup}
        disabled={loading}
        className='w-full bg-primary text-white font-bold py-2 rounded hover:bg-secondary transition'
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
};

export default CreateGroupForm;