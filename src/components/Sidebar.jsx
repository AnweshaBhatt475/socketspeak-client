import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus, FaImage, FaVideo, FaUsers } from "react-icons/fa6";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { logout } from '../redux/userSlice';

const Sidebar = () => {
  const user = useSelector(state => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [groups, setGroups] = useState([]); // ✅ Added for group chat
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection && user?._id) {
      socketConnection.emit('sidebar', user._id);

      socketConnection.on('conversation', (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
            return { ...conversationUser, userDetails: conversationUser?.sender };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return { ...conversationUser, userDetails: conversationUser.receiver };
          } else {
            return { ...conversationUser, userDetails: conversationUser.sender };
          }
        });

        setAllUser(conversationUserData);
      });

      // ✅ Fetch groups (new addition)
      socketConnection.emit("get-groups", user._id);
      socketConnection.on("group-list", (data) => {
        setGroups(data || []);
      });

      return () => {
        socketConnection.off('conversation');
        socketConnection.off('group-list'); // ✅ cleanup
      };
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white overflow-hidden lg:grid-cols-[48px,1fr]'>
      {/* Navigation icons */}
      <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer rounded transition duration-150 ease-in-out 
              ${isActive ? "bg-slate-300" : "hover:bg-slate-200"}`
            }
            title='Chat'
          >
            <IoChatbubbleEllipses size={22} />
          </NavLink>

          <div
            title='Add Friend'
            onClick={() => setOpenSearchUser(true)}
            className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded transition duration-150 ease-in-out'
          >
            <FaUserPlus size={20} />
          </div>

          {/* ✅ Group Chat Button */}
          <NavLink
            to="/groups"
            title="Group Chats"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer rounded transition duration-150 ease-in-out 
              ${isActive ? "bg-slate-300" : "hover:bg-slate-200"}`
            }
          >
            <FaUsers size={20} />
          </NavLink>
        </div>

        <div className='flex flex-col items-center gap-2'>
          <button className='mx-auto' title={user?.name} onClick={() => setEditUserOpen(true)}>
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={
                user?.profile_pic?.startsWith('http')
                  ? user?.profile_pic
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`
              }
              userId={user?._id}
            />
          </button>
          <button
            title='Logout'
            className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded transition duration-150 ease-in-out'
            onClick={handleLogout}
          >
            <span className='-ml-2'>
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* Sidebar body */}
      <div className='w-full flex flex-col'>
        <div className='h-16 flex items-center border-b border-slate-200'>
          <h2 className='text-xl font-bold p-4 text-slate-800'>Messages</h2>
        </div>

        <div className='flex-grow overflow-y-auto overflow-x-hidden px-2 scrollbar'>
          {allUser.length === 0 ? (
            <div className='mt-12'>
              <div className='flex justify-center items-center my-4 text-slate-500'>
                <FiArrowUpLeft size={50} />
              </div>
              <p className='text-lg text-center text-slate-400'>
                Explore users to start a conversation with.
              </p>
            </div>
          ) : (
            allUser.map((conv, index) => (
              <NavLink
                to={`/${conv?.userDetails?._id}`}
                key={conv?._id || index}
                className='flex items-center gap-3 py-3 px-2 border border-transparent hover:border-lavender-400 rounded-lg hover:bg-slate-100 cursor-pointer transition duration-200'
              >
                <Avatar
                  imageUrl={
                    conv?.userDetails?.profile_pic?.startsWith('http')
                      ? conv.userDetails.profile_pic
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(conv?.userDetails?.name || "User")}`
                  }
                  name={conv?.userDetails?.name}
                  width={40}
                  height={40}
                />
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-base text-ellipsis line-clamp-1'>
                    {conv?.userDetails?.name}
                  </h3>
                  <div className='text-slate-500 text-xs flex flex-wrap items-center gap-2'>
                    {conv?.lastMsg?.imageUrl && (
                      <span className='flex items-center gap-1'>
                        <FaImage />
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </span>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <span className='flex items-center gap-1'>
                        <FaVideo />
                        {!conv?.lastMsg?.text && <span>Video</span>}
                      </span>
                    )}
                    <span className='text-ellipsis line-clamp-1'>
                      {conv?.lastMsg?.text}
                    </span>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <span className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>
                    {conv?.unseenMsg}
                  </span>
                )}
              </NavLink>
            ))
          )}

          {/* ✅ Group Section */}
          {groups.length > 0 && (
            <div className='mt-6'>
              <h4 className='text-slate-600 text-sm px-2 mb-2 font-semibold'>Your Groups</h4>
              {groups.map((group) => (
                <NavLink
                  to={`/group/${group._id}`}
                  key={group._id}
                  className='flex items-center gap-3 py-3 px-2 border border-transparent hover:border-blue-300 rounded-lg hover:bg-slate-100 cursor-pointer transition duration-200'
                >
                  <Avatar
                    name={group.name}
                    width={40}
                    height={40}
                    imageUrl={group.profile_pic || ""}
                  />
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-base text-ellipsis line-clamp-1'>
                      {group.name}
                    </h3>
                    <p className='text-slate-500 text-xs line-clamp-1'>
                      {group.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit user modal */}
      {editUserOpen && <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />}

      {/* Search user modal */}
      {openSearchUser && <SearchUser onClose={() => setOpenSearchUser(false)} />}
    </div>
  );
};

export default Sidebar;
