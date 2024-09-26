import { useContext, useState } from 'react';
import {Nav,Navbar,Stack,Container} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { Content } from '@radix-ui/react-dialog';
import { Sidebar } from 'lucide-react';

const NavBar = () => {
    const {user,logoutUser,setBarOpen,isBarOpen} = useContext(AuthContext)
    
    return ( 
        <div  className=' h-[5vh] sm:w-full w-auto sm:flex flex sm:justify-between justify-around items-center uppercase  gap-8 px-3 py-3 bg-black'>
            <div className='flex sm:w-screen  w-fit justify-between items-center sm:p-2 p-3 sm:text-nowrap text-nowrap sm:text-sm text-xl'>
                <div className='flex sm:hidden items-center mr-6'>
                <button className='sm:hidden text-white m-0' >
                    <NavLink onClick={()=>setBarOpen(!isBarOpen)} to='/'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    </NavLink>
                </button>
                </div>
                <h2>    
                <NavLink to='/' className="  link-light text-decoration-none items-center sm:mr-auto mr-8 sm:ml-auto ml-8 p-1">TeamsConnect</NavLink>
                </h2>
                {user && <span className='text-warning sm:block hidden'>Logged in as {user?.name}</span>}
                <Nav>
                    <Stack direction='horizontal' className='flex justify-between' gap={3}>
                    {
                        user && (
                        <div className='flex sm:flex-row flex-col  sm:items-center items-end sm-right-auto right-0 justify-around mr-5 p-2 gap-3'>
                             <NavLink to='/profile' className="flex items-center justify-center p-2  ml-[7vw] sm:mr-auto mr-0 w-[25px] h-[20px] bg-gray-300 rounded-full overflow-hidden">
                         <span class="material-symbols-outlined">
                            person
                            </span>
                        </NavLink>

                        <NavLink onClick={()=>logoutUser()} to='/login' className="link-light items-center text-decoration-none sm:block hidden">
                            <div><span class="material-symbols-outlined text-blue-400 text-2xl  "style= {{fontSize:'1rem'  }} >
                         directions_run</span>
                         <span class="material-symbols-outlined text-blue-400 mt-1 " style= {{fontSize:'1rem' }}>
                         door_open</span>
                         </div>
                         
                         </NavLink>


                        


                            
                   
                        </div>)
                    }
                    {!user && (<>
                        <NavLink to='/login' className="link-light text-decoration-none">Login</NavLink>
                    <NavLink to='/register' className="link-light text-decoration-none">Register</NavLink>
                    
                    </>)}
                    </Stack>
                </Nav>
            </div>
        </div>
     );
}
 
export default NavBar;