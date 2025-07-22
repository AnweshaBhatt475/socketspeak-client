import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';

export default function GroupChat() {
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = useRef();
  const user = useSelector((state) => state?.user); // ✅ get logged in user

  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });

    socket.current.emit('join-group', groupId);

    socket.current.on('new-group-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [groupId]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/group/${groupId}`,
        { withCredentials: true }
      );
      setGroup(res.data.data);
      setMessages(res.data.data.messages);
    })();
  }, [groupId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.current.emit('group-message', {
      groupId,
      text: message,
      sender: user?._id,
      createdAt: new Date(),
    });

    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50">
      {/* Header */}
      <header className="p-4 bg-white shadow font-semibold text-lg sticky top-0 z-10">
        {group.name}
      </header>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar">
        {messages.map((m) => {
          const isSelf = m.sender === user._id || m.sender?._id === user._id;
          return (
            <div
              key={m._id}
              className={`flex flex-col ${
                isSelf ? 'items-end text-right' : 'items-start'
              }`}
              ref={scrollRef}
            >
              <div
                className={`px-4 py-2 max-w-xs rounded-lg shadow text-sm ${
                  isSelf
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white text-slate-800 rounded-bl-none'
                }`}
              >
                {!isSelf && (
                  <p className="font-semibold text-xs mb-1 text-slate-500">
                    {m.sender?.name || 'User'}
                  </p>
                )}
                <p>{m.text}</p>
              </div>
              <span className="text-xs mt-1 text-slate-400">
                {moment(m.createdAt).format('hh:mm A')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={send}
        className="p-4 bg-white border-t flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary hover:bg-secondary transition text-white px-4 py-2 rounded font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
}
