import { useContext } from 'react';
import {Nav,Navbar,Stack,Container} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { Content } from '@radix-ui/react-dialog';

const NavBar = () => {
    const {user,logoutUser} = useContext(AuthContext)
    return ( 
        <div  className=' h-[5vh] w-screen  md:grid justify-center uppercase items-center gap-8 px-3 bg-black'>
            <div className='flex'>
                <h2>
                    
                <NavLink to='/' className="mr-6  link-light text-deco ration-none items-center">TeamsConnect</NavLink>
                </h2>
                {user && <span className='text-warning ml-8'>Logged in as {user?.name}</span>}
                <Nav>
                    <Stack direction='horizontal' className='flex justify-between' gap={3}>
                    {
                        user && (
                        <div className='flex items-center justify-around p-2 gap-3'>
                             <NavLink to='/profile' className="flex items-center justify-center p-2  ml-[7vw] w-[25px] h-[20px] bg-gray-300 rounded-full overflow-hidden">
                         <span class="material-symbols-outlined">
                            person
                            </span>
                        </NavLink>

                        <NavLink onClick={()=>logoutUser()} to='/login' className="link-light items-center text-decoration-none">
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