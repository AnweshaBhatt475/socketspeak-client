import React, { useEffect, useState } from 'react';
import { IoSearchOutline, IoClose } from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSearchUser = async () => {
    try {
      setLoading(true);
      const URL = `${apiUrl}/api/search-user`;
      const response = await axios.post(URL, { search });
      setSearchUser(response.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to search user");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch default users via POST /api/search-user
  const fetchDefaultUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/api/search-user`, { search: "" }, { withCredentials: true });
      setSuggestedUsers(res.data?.data || []);
    } catch (error) {
      console.error("Default users fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultUsers(); // ✅ fetch default users on modal mount
  }, []);

  useEffect(() => {
    if (search.trim()) {
      handleSearchUser();
    } else {
      setSearchUser([]);
    }
  }, [search]);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start p-4 overflow-auto'>
      <div className='relative w-full max-w-lg mt-16 md:mt-20'>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className='absolute -top-4 -right-4 bg-white shadow p-2 rounded-full text-xl hover:bg-red-100 hover:text-red-600 transition'
        >
          <IoClose />
        </button>

        {/* Search Input */}
        <div className='bg-white shadow rounded-lg overflow-hidden flex items-center h-14'>
          <input
            type='text'
            placeholder='Search by name or email...'
            className='w-full px-4 py-2 outline-none text-sm'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className='h-14 w-14 flex justify-center items-center text-gray-500'>
            <IoSearchOutline size={22} />
          </div>
        </div>

        {/* Results Container */}
        <div className='bg-white mt-3 rounded-lg shadow p-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300'>
          {loading && <Loading />}

          {!loading && search && searchUser.length === 0 && (
            <p className='text-center text-slate-500 py-6'>No user found!</p>
          )}

          {!loading && searchUser.length > 0 && (
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))
          )}

          {/* ✅ Show suggested users when no search */}
          {!loading && search.trim() === "" && suggestedUsers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-2">People you may know:</h3>
              {suggestedUsers.map(user => (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;