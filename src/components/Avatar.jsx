import React, { useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name = "", imageUrl = "", width = 40, height = 40 }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const [imgError, setImgError] = useState(false);

  const avatarName = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const bgColor = [
    "bg-slate-200", "bg-teal-200", "bg-red-200", "bg-green-200",
    "bg-yellow-200", "bg-gray-200", "bg-cyan-200", "bg-sky-200", "bg-blue-200",
  ];
  const hash = name ? name.charCodeAt(0) % bgColor.length : 0;
  const isOnline = onlineUser?.includes(userId);

  const showImage = imageUrl?.startsWith("http") && !imgError;

  return (
    <div
      className="text-slate-800 rounded-full font-bold relative overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={name}
          width={width}
          height={height}
          className="rounded-full object-cover w-full h-full border border-slate-300 hover:scale-105 transition duration-150"
          onError={() => setImgError(true)}
        />
      ) : avatarName ? (
        <div
          className={`flex justify-center items-center text-lg ${bgColor[hash]}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {isOnline && (
        <div className="bg-green-600 p-[6px] absolute bottom-0 right-0 z-10 rounded-full border-[2px] border-white" />
      )}
    </div>
  );
};

export default Avatar;
