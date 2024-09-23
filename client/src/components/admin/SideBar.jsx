import Chat from '@/pages/Chat'
import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill,
  BsFillSkipBackwardBtnFill}
 from 'react-icons/bs'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
   
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": "bg-blue-200 w-auto"}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                {/* <Button href="#chat" title="chat" onClick={() => setActiveSection('chat')}/><Chat/> */}
                Profile DashBoard
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                
                    <BsGrid1X2Fill className='icon'/> Dashboard
                
            </li>
            <li className='sidebar-list-item'>
                
                    <BsFillArchiveFill className='icon'/> Products
                
            </li>
            <li className='sidebar-list-item'>
                
                    <BsFillGrid3X3GapFill className='icon'/> Applications
                
            </li>
            <li className='sidebar-list-item'>
                
                    <BsPeopleFill className='icon'/> Friends
                
            </li>
            <li className='sidebar-list-item'>
                
                    <BsListCheck className='icon'/> Tasks
                
            </li>
            <li className='sidebar-list-item'>
                
                    <BsMenuButtonWideFill className='icon'/> Reports
                
            </li>
            <li className='sidebar-list-item'>
                
                    <BsFillGearFill className='icon'/> Setting
                
            </li>
        </ul>
    </aside>

  )
}

export default Sidebar