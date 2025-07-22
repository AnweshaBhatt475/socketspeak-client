import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={`/${user?._id}`}
      onClick={onClose}
      className="flex items-center gap-4 p-3 lg:p-4 border-b border-slate-200 hover:border-primary hover:bg-slate-50 transition duration-150 rounded-md cursor-pointer"
    >
      <Avatar
        width={50}
        height={50}
        name={user?.name}
        userId={user?._id}
        imageUrl={user?.profile_pic}
      />

      <div className="min-w-0">
        <div className="font-semibold text-base text-slate-800 truncate">
          {user?.name}
        </div>
        <p className="text-sm text-slate-500 truncate">
          {user?.email}
        </p>
      </div>
    </Link>
  );
};

export default UserSearchCard;