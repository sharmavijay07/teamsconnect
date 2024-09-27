import { Group, Chat, CalendarToday, VideoCall, Folder, MoreHoriz, Report, Analytics, Settings, FileUpload } from '@mui/icons-material';
import './styles.css';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import UserGroups from './UserGroups';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
// import FileUploads from '../fileHandling/FileUploads';

function Sidebar({ setActiveSection }) {
    const {isBarOpen} = useContext(AuthContext)
    return (
        <div 
        className={isBarOpen?
            "sidebar closed border-r-2 border-black bg-blue-300 sm:block hidden"
            :
            "sidebar absolute h-[85vh] w-[50vw] backdrop-blur-lg bg-black/20 open border-r-2 border-black  block"
        }
        >
            <div className="sidebar-icons visible">
                <a className='group' href="#group"   onClick={() => setActiveSection('group')}><Group />
                <span className='absolute left-[80px] scale-0 group-hover:scale-100 transition-all bg-black  text-white p-2 rounded '> Group </span>
                </a>
                <a href="#chat" title="chat" onClick={() => setActiveSection('chat')}><Chat /></a>
                <a href="#calendar"  title="Calendar" onClick={() => setActiveSection('calendar')}><CalendarToday /></a>
                <a href="#video" title="Video" onClick={() => setActiveSection('video')}><VideoCall /></a>
                <a href="#files" title="Files" onClick={() => setActiveSection('files')}><Folder /></a>
                <a href="#reports" title="reports" onClick={() => setActiveSection('reports')}><Report /></a>
                <a href="#analytics" title="analytics" onClick={() => setActiveSection('analytics')}><Analytics /></a>
                <a href="#more" title="more" onClick={() => setActiveSection('more')}><MoreHoriz /></a>
            </div>
            <div  className="sidebar-icons visible"> 
                <a href="#settings" title="Settings" className='setting' onClick={() => setActiveSection('settings')}><Settings /></a>
            </div>

        </div>
    );
}

Sidebar.propTypes = {
    setActiveSection: PropTypes.func.isRequired, // Ensure the function is passed
};

export default Sidebar;
