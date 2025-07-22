import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const WallpaperSelector = ({ userId, onWallpaperChange }) => {
  const [selectedUrl, setSelectedUrl] = useState("");

  const wallpapers = [
    "/images/wallpapers/flowers.jpg",
    "/images/wallpapers/mountains.jpg",
    "/images/wallpapers/dark.jpg",
    // Add your own static images or Cloudinary URLs
  ];

  const handleChange = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/update-wallpaper`;
      const res = await axios.post(URL, { wallpaperUrl: selectedUrl, userId }, { withCredentials: true });
      toast.success("Wallpaper updated!");
      onWallpaperChange(selectedUrl); // optional callback
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex gap-2 overflow-x-auto">
        {wallpapers.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="wallpaper"
            className={`w-24 h-16 object-cover cursor-pointer border rounded ${selectedUrl === url ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedUrl(url)}
          />
        ))}
      </div>

      <button
        onClick={handleChange}
        disabled={!selectedUrl}
        className="bg-primary text-white py-1 px-4 rounded hover:bg-secondary"
      >
        Apply Wallpaper
      </button>
    </div>
  );
};

export default WallpaperSelector;