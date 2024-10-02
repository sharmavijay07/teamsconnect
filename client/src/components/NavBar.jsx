import { useContext } from 'react';
import { Nav, Stack } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BsPersonCircle } from 'react-icons/bs';

const NavBar = () => {
    const { user, logoutUser, setBarOpen, isBarOpen } = useContext(AuthContext);

    return (
        <div className='h-[5vh] sm:w-full w-auto sm:flex flex sm:justify-between justify-around items-center uppercase gap-8 px-3 py-3 bg-black'>
            <div className='flex sm:w-screen w-fit justify-between items-center sm:p-2 p-3 sm:text-nowrap text-nowrap sm:text-sm text-xl'>

                {/* Sidebar Toggle Button */}
                <div className='flex sm:hidden items-center mr-6'>
                    <button className='sm:hidden text-white m-0' onClick={() => setBarOpen(!isBarOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                {/* Logo / App Name */}
                <h2 className='flex'>
                    <NavLink to='/' className="link-light text-decoration-none items-center sm:mr-auto mr-8 sm:ml-auto ml-8 p-1">TeamsConnect</NavLink>
                </h2>

                {/* Display user info if logged in */}
                {user && <span className='text-warning sm:block hidden'>Logged in as {user?.name}</span>}

                {/* Navigation Links */}
                <Nav>
                    <Stack direction='horizontal' className='flex justify-between' gap={3}>
                        {user ? (
                            <div className='flex sm:flex-row flex-col sm:items-center items-end justify-around mr-5 p-2 gap-3'>
                                
                                {/* Profile Icon */}
                                <NavLink to='/profile' className="flex items-center justify-center w-[25px] h-[25px] bg-white rounded-full overflow-hidden">
                                    <BsPersonCircle size={25} />
                                </NavLink>

                                {/* Logout Button */}
                                <NavLink onClick={() => logoutUser()} to='/login' className="link-light text-decoration-none sm:block hidden">
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-blue-400" style={{ fontSize: '1rem' }}>
                                            directions_run
                                        </span>
                                        <span className="material-symbols-outlined text-blue-400 mt-1" style={{ fontSize: '1rem' }}>
                                            door_open
                                        </span>
                                    </div>
                                </NavLink>

                            </div>
                        ) : (
                            <>
                                {/* Login/Register Links */}
                                <NavLink to='/login' className="link-light text-decoration-none">Login</NavLink>
                                <NavLink to='/register' className="link-light text-decoration-none">Register</NavLink>
                            </>
                        )}
                    </Stack>
                </Nav>
            </div>
        </div>
    );
};

export default NavBar;
