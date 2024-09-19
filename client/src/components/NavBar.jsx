import { useContext } from 'react';
import {Nav,Navbar,Stack,Container} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
    const {user,logoutUser} = useContext(AuthContext)
    return ( 
        <Navbar bg='dark' className='' style={{height:'5vh'}}>
            <Container>
                <h2>
                    
                <NavLink to='/' className="link-light text-deco ration-none">TeamsConnect</NavLink>
                </h2>
                {user && <span className='text-warning'>Logged in as {user?.name}</span>}
                <Nav>
                    <Stack direction='horizontal' gap={3}>
                    {
                        user && (
                        <div className='flex items-center'>
                        <NavLink onClick={()=>logoutUser()} to='/login' className="link-light text-decoration-none">
                            <div><span class="material-symbols-outlined text-blue-400 text-2xl  "style= {{fontSize:'1rem'  }} >
                         directions_run</span>
                         <span class="material-symbols-outlined text-blue-400 mt-1 " style= {{fontSize:'1rem' }}>
                         door_open</span>
                         </div>
                         
                         </NavLink>


                         <NavLink to='/profile' className="flex items-center justify-center p-2  ml-[7vw] w-[25px] h-[20px] bg-gray-300 rounded-full overflow-hidden">
                         <span class="material-symbols-outlined">
                            person
                            </span>
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
        </Navbar>
     );
}
 
export default NavBar;