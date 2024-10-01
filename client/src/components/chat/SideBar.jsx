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
            "sidebar closed border-r-2 border-black bg-blue-300 sm:block hidden sm:flex sm:flex-col sm:justify-between"
            :
            "sidebar absolute h-[85vh] w-[40vw] backdrop-blur-lg bg-black/20 open border-r-2 border-black  block flex flex-col justify-between"
        }
        >
            <div className="sidebar-icons visible flex flex-col items-start w-full">
                
                <a className='group pl-4' href="#group"   onClick={() => setActiveSection('group')}><Group />
                <span className={isBarOpen?'absolute left-[80px] bottom-[10px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100  pl-4 items-center text-left '}> Group </span>
                </a>
                
                <a href="#chat" className='group pl-4' onClick={() => setActiveSection('chat')}><Chat />
                <span className={isBarOpen?'absolute left-[80px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100 pl-4 items-center text-left'}> Chat </span>
                </a>
                <a href="#calendar"  className='group pl-4' onClick={() => setActiveSection('calendar')}><CalendarToday />
                <span className={isBarOpen?'absolute left-[80px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100 pl-4  items-center text-left'}> Calendar </span>
                </a>
                <NavLink to='/video' className='group pl-4' onClick={() => setActiveSection('video')}><VideoCall />
                <span className={isBarOpen?'absolute left-[80px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100 pl-4  items-center text-left'}> Video </span>
                </NavLink>
                <NavLink to='/audio' className='group pl-4' onClick={() => setActiveSection('files')}><Folder />
                <span className={isBarOpen?'absolute left-[80px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100 pl-4  items-center text-left'}> Files </span>
                </NavLink>
                <a href="#reports" className='group pl-4' onClick={() => setActiveSection('reports')}><Report />
                <span className={isBarOpen?'absolute left-[80px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100 pl-4  items-center text-left'}> Reports </span>
                </a>
                <a href="#analytics" className='group pl-4' onClick={() => setActiveSection('analytics')}><Analytics />
                <span className={isBarOpen?'absolute left-[80px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100 pl-4  items-center text-left'}> Analytics </span>
                </a>
                <a href="#more" className='group pl-4' onClick={() => setActiveSection('more')}><MoreHoriz />
                <span className={isBarOpen?'absolute left-[80px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100 pl-4  items-center text-left'}> More </span>
                </a>
            </div>
            <div  className="sidebar-icons visible flex flex-col items-start w-full"> 
                <a href="#settings" title="Settings" className='setting pl-4' onClick={() => setActiveSection('settings')}><Settings />
                <span className={isBarOpen?'absolute left-[80px] scale-0 group-hover:scale-100 transition-all delay-50 bg-black  text-white p-2 rounded ':'scale-100 pl-4  items-center text-left'}> Settings </span>
                </a>
            </div>

        </div>
    );
}

Sidebar.propTypes = {
    setActiveSection: PropTypes.func.isRequired, // Ensure the function is passed
};

export default Sidebar;
