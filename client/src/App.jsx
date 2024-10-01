import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext'
import { GroupProvider } from './context/GroupContext'
import { CardWithForm } from './pages/CardWithForm'
import Group from './components/chat/Group'
import GroupVideoConference from './components/GroupVideoConference'
import GroupPage from './components/group/GroupChatPage'
import UserGroups from './components/chat/UserGroups'
import Profile from './components/profile/Profile'
import {useState} from 'react'
import { ToastContainer } from 'react-toastify';
import Videohome from './components/video/videohome'
import Sign from './components/video/sign'
import VoiceRecorder from './components/Voice_message/Voice_messages'
import Room from './components/chat/OriginalVideo/Room'
import HomePage from './components/chat/OriginalVideo/HomePage'
import Audiohome from './components/chat/OriginalVideo/Audiohome'
import AudioRoom from './components/chat/OriginalVideo/AudioRoom'
import { Calendar } from 'lucide-react'
import { CalendarContextProvider } from './context/CalendarContext'
import IdleTracker from './components/IdleTracker'

// import './components/chat/mobile/mobile'


function App() {
  const {user} = useContext(AuthContext)


  return (
    
    <ChatContextProvider user={user}>
      <IdleTracker/>
      <GroupProvider>
      <CalendarContextProvider>
        <Routes>
          <Route path='/' element={user?<Chat />:<Login />} />
          <Route path='/login' element={user?<Chat />:<Login />} />
          <Route path='/register' element={user?<Chat />:<Register />} />
          <Route path='*' element={<Navigate to='/'/>} />
          <Route path='/form' element={<CardWithForm />} />
          <Route path='/group' element={<Group />} />
          <Route path="/room" element={<GroupVideoConference />} />
          {/* <Route path="/grouppage" element={<GroupPage />} /> */}
          <Route path="/usergroups" element={<UserGroups />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/videohome" element={<Videohome />} />
          <Route path="/videohome/:meetingId/:uid" element={<Videohome />} />

          <Route path="/voice_message" element={<VoiceRecorder/>}/>
          {/* <Route path="/videohome" element={<Video />} /> */}
          <Route path="/sign" element={<Sign />} />
          <Route path="/video" element={<HomePage />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/audio" element={< Audiohome/>} />
          <Route path="/audio/:roomId" element={<AudioRoom />} />
          <Route path="/tracker" element={<IdleTracker />} />

          


         

      </Routes>
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          />
      </CalendarContextProvider>
      </GroupProvider>
    
    </ChatContextProvider>
    
  )
}

export default App

