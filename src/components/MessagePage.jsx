import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '../assets/wallapaper.jpeg'
import { IoMdSend } from "react-icons/io";
import moment from 'moment'

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: ""
  })

  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const [previewMedia, setPreviewMedia] = useState(null)
  const [typingStatus, setTypingStatus] = useState(false)
  const currentMessage = useRef(null)

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessage])

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file?.type.startsWith('image/')) {
      alert('Please upload a valid image file.')
      return
    }
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(preve => ({
      ...preve,
      imageUrl: uploadPhoto.url
    }))
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]
    if (!file?.type.startsWith('video/')) {
      alert('Please upload a valid video file.')
      return
    }
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(preve => ({
      ...preve,
      videoUrl: uploadPhoto.url
    }))
  }

  const handleUploadAudio = async (e) => {
    const file = e.target.files[0]
    if (!file?.type.startsWith('audio/')) {
      alert('Please upload a valid audio file.')
      return
    }
    setLoading(true)
    const uploadAudio = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(preve => ({
      ...preve,
      audioUrl: uploadAudio.url
    }))
  }

  const handleClearUpload = (type) => {
    setMessage(preve => ({
      ...preve,
      [type]: ""
    }))
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId)
    //  socketConnection.emit('seen', params.userId)

      const handleUserData = (data) => setDataUser(data)
      const handleMessages = (data) => setAllMessage(data)
      const handleTyping = () => setTypingStatus(true)
      const handleTypingStop = () => setTypingStatus(false)

      socketConnection.on('message-user', handleUserData)
      socketConnection.on('message', handleMessages)
      socketConnection.on('typing', handleTyping)
      socketConnection.on('typing-stop', handleTypingStop)

      return () => {
        socketConnection.off('message-user', handleUserData)
        socketConnection.off('message', handleMessages)
        socketConnection.off('typing', handleTyping)
        socketConnection.off('typing-stop', handleTypingStop)
      }
    }
  }, [socketConnection, params?.userId, user])
  
  useEffect(() => {
  if (socketConnection && allMessage.length > 0) {
    const lastMsg = allMessage[allMessage.length - 1];

    if (
      lastMsg?.msgByUserId !== user._id &&
      !lastMsg?.seen
    ) {
      socketConnection.emit('seen', params.userId);
    }
  }
}, [allMessage, socketConnection, params.userId, user._id]);

  const handleOnChange = (e) => {
    const { value } = e.target
    setMessage(preve => ({
      ...preve,
      text: value
    }))

    if (socketConnection) {
      socketConnection.emit('typing', params.userId)
      setTimeout(() => {
        socketConnection.emit('typing-stop', params.userId)
      }, 1500)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.text || message.imageUrl || message.videoUrl || message.audioUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          audioUrl: message.audioUrl,
          msgByUserId: user?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          audioUrl: ""
        })
      }
    }
  }

  return (
    <div
      className="relative flex-grow"
      style={{
        backgroundImage: `url(${user?.wallpaper || "/images/wallpapers/default.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover'>

        {/* Header */}
        <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
          <div className='flex items-center gap-4'>
            <Link to={"/"} className='lg:hidden'><FaAngleLeft size={25} /></Link>
            <Avatar width={50} height={50} imageUrl={dataUser?.profile_pic} name={dataUser?.name} userId={dataUser?._id} />
            <div>
              <h3 className='font-semibold text-lg text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
              <p className='-my-2 text-sm'>
                {typingStatus ? <span className='text-blue-500 animate-pulse'>Typing...</span> : dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>}
              </p>
            </div>
          </div>
          <button className='cursor-pointer hover:text-primary'><HiDotsVertical /></button>
        </header>

        {/* Messages */}
        <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
          <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
            {allMessage.map((msg, index) => (
              <div key={msg._id || index} className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                <div className='w-full relative space-y-1'>
                  {msg?.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      onClick={() => setPreviewMedia({ type: 'image', url: msg.imageUrl })}
                      className='w-full h-full object-scale-down cursor-pointer rounded'
                      title="Click to view/download"
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      onClick={() => setPreviewMedia({ type: 'video', url: msg.videoUrl })}
                      className='w-full h-full object-scale-down cursor-pointer rounded'
                      controls
                      title="Click to view/download"
                    />
                  )}
                  {msg?.audioUrl && (
                    <audio
                      src={msg.audioUrl}
                      className='w-full'
                      controls
                      title="Audio message"
                    />
                  )}
                </div>
                <p className='px-2'>{msg.text}</p>
                {/* <p className='text-xs ml-auto w-fit flex items-center gap-1'>
                  {moment(msg.createdAt).format('hh:mm')}
                  {user._id === msg?.msgByUserId && <span className="text-green-600">✔️</span>}
                </p> */}
                <p className='text-xs ml-auto w-fit flex items-center gap-1'>
  {moment(msg.createdAt).format('hh:mm')}
  {user._id === msg?.msgByUserId && (
    <>
      {msg.seen ? (
        <span className="text-blue-500 text-sm">✔✔</span> // seen = double blue tick
      ) : (
        <span className="text-gray-500 text-sm">✔</span>   // not seen = single gray tick
      )}
    </>
  )}
</p>

              </div>
            ))}
          </div>

          {/* Previews */}
          {['imageUrl', 'videoUrl', 'audioUrl'].map((type) =>
            message[type] && (
              <div key={type} className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden transition-all duration-300 ease-in-out'>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600 z-10 transition-opacity duration-300' onClick={() => handleClearUpload(type)}>
                  <IoClose size={30} />
                </div>
                <div className='bg-white p-3 rounded shadow-lg transition-transform duration-300 max-w-[90%]'>
                  {type === 'imageUrl' && <img src={message[type]} className='aspect-square w-full h-full max-w-xs sm:max-w-sm m-2 object-scale-down' />}
                  {type === 'videoUrl' && <video src={message[type]} className='aspect-square w-full h-full max-w-xs sm:max-w-sm m-2 object-scale-down' controls autoPlay muted />}
                  {type === 'audioUrl' && <audio src={message[type]} className='w-full' controls autoPlay />}
                </div>
              </div>
            )
          )}

          {loading && <div className='w-full h-full flex sticky bottom-0 justify-center items-center'><Loading /></div>}
        </section>

        {/* Input Area */}
        <section className='h-16 bg-white flex items-center px-4'>
          <div className='relative'>
            <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
              <FaPlus size={20} />
            </button>

            {openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'><FaImage size={18} className='text-primary' /><p>Image</p></label>
                  <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'><FaVideo size={18} className='text-purple-500' /><p>Video</p></label>
                  <label htmlFor='uploadAudio' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'><span className='text-blue-600'>🎙</span><p>Audio</p></label>

                  <input type='file' id='uploadImage' onChange={handleUploadImage} className='hidden' accept="image/*" />
                  <input type='file' id='uploadVideo' onChange={handleUploadVideo} className='hidden' accept="video/*" />
                  <input type='file' id='uploadAudio' onChange={handleUploadAudio} className='hidden' accept="audio/*" />
                </form>
              </div>
            )}
          </div>

          <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
            <input type='text' placeholder='Type here message...' className='py-1 px-4 outline-none w-full h-full' value={message.text} onChange={handleOnChange} />
            <button className='text-primary hover:text-secondary'><IoMdSend size={28} /></button>
          </form>
        </section>

        {/* Preview Modal */}
        {previewMedia && (
          <div className='fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center p-4 transition-opacity duration-500'>
            <div className='relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col justify-center items-center p-4 overflow-auto animate-fade-in'>
              <button onClick={() => setPreviewMedia(null)} className='absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl transition duration-200'>
                <IoClose />
              </button>
              <a href={previewMedia.url} download target='_blank' rel='noreferrer' className='absolute top-3 left-3 px-4 py-1 bg-primary text-white rounded hover:bg-secondary text-sm font-medium shadow'>
                Download
              </a>
              <div className='w-full max-h-[80vh] flex justify-center items-center'>
                {previewMedia.type === 'image' && <img src={previewMedia.url} className='max-h-[80vh] max-w-full object-contain rounded transition-all duration-300' />}
                {previewMedia.type === 'video' && <video src={previewMedia.url} className='max-h-[80vh] max-w-full rounded' controls autoPlay />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagePage
