import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';
import uploadFile from '../helpers/uploadFile';
import { IoClose } from 'react-icons/io5';

export default function GroupChat() {
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const socketRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });
    socketRef.current.emit('join-group', groupId);
    socketRef.current.on('new-group-message', (msg) => setMessages(prev => [...prev, msg]));
    return () => socketRef.current.disconnect();
  }, [groupId]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/group/${groupId}`, { withCredentials: true });
      setGroup(res.data.data);
      setMessages(res.data.data.messages);
    })();
  }, [groupId]);

  const send = async (e) => {
    e.preventDefault();
    if (!text && !file) return;

    let imageUrl, videoUrl, audioUrl;
    if (file) {
      const uploaded = await uploadFile(file);
      if (file.type.startsWith('image/')) imageUrl = uploaded.url;
      else if (file.type.startsWith('video/')) videoUrl = uploaded.url;
      else if (file.type.startsWith('audio/')) audioUrl = uploaded.url;
    }

    const msg = {
      groupId,
      text,
      imageUrl,
      videoUrl,
      audioUrl,
      sender: 'me',
      createdAt: new Date().toISOString(),
    };

    socketRef.current.emit('group-message', msg);
    setText('');
    setFile(null);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <button onClick={() => navigate(-1)} className="text-primary text-lg">&larr;</button>
        <h2 className="font-semibold">{group.name || 'Group'}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m._id} className="flex flex-col bg-white p-3 rounded shadow-sm">
            {m.text && <p>{m.text}</p>}
            {m.imageUrl && <img src={m.imageUrl} className="max-w-full rounded" />}
            {m.videoUrl && <video src={m.videoUrl} controls className="max-w-full rounded" />}
            {m.audioUrl && <audio src={m.audioUrl} controls className="w-full mt-2" />}
            <small className="text-gray-400 mt-1">{moment(m.createdAt).format('hh:mm')}</small>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 p-4 bg-white">
        <input
          type="file"
          id="upload"
          className="hidden"
          onChange={e => setFile(e.target.files[0])}
          accept="image/*,video/*,audio/*"
        />
        {file && (
          <div className="relative">
            <span className="inline-block px-2 py-1 bg-gray-100 rounded">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <IoClose size={16} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => document.getElementById('upload').click()}
          className="p-2 text-primary hover:text-secondary"
        >
          📎
        </button>

        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit" className="bg-primary px-4 py-2 rounded text-white">
          Send
        </button>
      </form>
    </div>
  );
}
