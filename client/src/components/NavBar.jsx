import { useContext } from 'react';
import {Nav,Navbar,Stack,Container} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { Content } from '@radix-ui/react-dialog';

const NavBar = () => {
    const {user,logoutUser} = useContext(AuthContext)
    return ( 
        <div  className='md:bg-white h-[5vh] bg-black  uppercase items-center '>
            <Container className='flex p-1  justify-between items-center'>

                <h2>
                    
                <NavLink to='/' className=" link-light text-decoration-none font">TeamsConnect</NavLink>
                </h2>
                {user && <span className='text-warning ml-8'>Logged in as {user?.name}</span>}
                <Nav>
                    <Stack direction='horizontal' className='flex justify-between' gap={3}>
                    {
                        user && (
                        <div className='flex items-center justify-around gap-3'>
                             <NavLink to='/profile' className="flex items-center justify-center  ml-[7vw] w-[25px] h-[20px] bg-gray-300 rounded-full overflow-hidden">
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
            </Container>
        </div>
     );
}
 
export default NavBar;