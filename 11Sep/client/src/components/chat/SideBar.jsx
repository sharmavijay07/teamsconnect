import { Group, Chat, CalendarToday, Call, Folder, MoreHoriz, Report, Analytics, Settings } from '@mui/icons-material';
import './styles.css';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import UserGroups from './UserGroups';

function Sidebar({ setActiveSection }) {
    return (
        <div className="sidebar closed border-r-2 border-black">
            <div className="sidebar-icons visible">
                <a href="#group"  title="Group" onClick={() => setActiveSection('group')}><Group /></a>
                <a href="#chat" title="chat" onClick={() => setActiveSection('chat')}><Chat /></a>
                <a href="#calendar"  title="Calendar" onClick={() => setActiveSection('calendar')}><CalendarToday /></a>
                <a href="#call" title="Call" onClick={() => setActiveSection('call')}><Call /></a>
                <a href="#files" title="Files" onClick={() => setActiveSection('files')}><Folder /></a>
                <a href="#reports" title="reports" onClick={() => setActiveSection('reports')}><Report /></a>
                <a href="#analytics" title="analytics" onClick={() => setActiveSection('analytics')}><Analytics /></a>
                <a href="#more" title="more" onClick={() => setActiveSection('more')}><MoreHoriz /></a>
                <NavLink to='/usergroups' >groups</NavLink>
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
