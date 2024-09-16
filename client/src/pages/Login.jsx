import { useContext } from 'react';
import {Alert,Button, Form,Row,Col,Stack} from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Login = () => {

    const {updateLoginInfo,
        loginUser,
        loginError,
        loginInfo,
        isLoginLoading} = useContext(AuthContext)
    return ( 
        // <>
        // <Form onSubmit={loginUser}>  
        //     <Row style={{
        //         height:'100vh',
        //         justifyContent:'center',
        //         paddingTop:'20%'
        //     }}>
        //         <Col xs={6}>
        //         <Stack gap={3}>
        //             <h2>Login</h2>
                    
        //             <Form.Control type='email' placeholder='Enter email' onChange={(e)=>updateLoginInfo({...loginInfo,email:e.target.value})}/>
        //             <Form.Control type='password' placeholder='Enter password' onChange={(e)=>updateLoginInfo({...loginInfo,password:e.target.value})}/>
        //             <Button variant='primary' type='submit'>
        //             {
        //                 isLoginLoading ? "Taking you there":"Login"
        //             }
        //             </Button>
        //             {
        //                 loginError?.error && <Alert variant='danger'><p>{loginError?.message}</p></Alert>
        //             }
                    
        //         </Stack>
        //         </Col>
        //     </Row>
        // </Form>
        // </>

        <div className="flex flex-col justify-center items-end h-90vh mt-10">
      <img src="/src/assets/login.png" className="absolute bottom-0 left-0 -z-50 w-auto h-auto" alt="a person working on his desk" />
      <Card className="w-[60vh] mr-20 sm:mr-20 md:mr-25 lg:mr-60 border-0 shadow-none mt-16 bg-none rounded-5">
        <CardHeader className="items-center" >
          <CardTitle>Login</CardTitle>
          <CardTitle>Welcome Back !</CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={loginUser}>
            <div className="grid w-full items-center">
              <div className="flex flex-col space-y-1.5">
                <Label className="relative top-5 w-1/5 ml-4 bg-white p-2" htmlFor="name">E-mail</Label>
                <Input className="rounded" id="name" type='email' placeholder='Enter email' onChange={(e)=>updateLoginInfo({...loginInfo,email:e.target.value})} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="relative top-5 w-1/4 ml-4 bg-white p-2" htmlFor="framework">Password</Label>
                <Input className="rounded" id="password" type='password' placeholder='Enter password' onChange={(e)=>updateLoginInfo({...loginInfo,password:e.target.value})} />
              </div>
              <br />
              <div className="flex flex-col items-center space-x-2">
                {/* <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </label> */}
                <Button type="submit" className="w-4/6 bg-black rounded-4">
          {
                isLoginLoading ? "Taking you there":"Login"
           }
           </Button>
              </div>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
         
           {
                        loginError?.error && <Alert variant='danger'><p>{loginError?.message}</p></Alert>
                     }
        </CardFooter>
        <CardFooter>
          <a href="#"><u>Trouble Logging in ?</u></a>
        </CardFooter>
        <CardFooter>
        <NavLink to='/register'><b>New User?</b> <u>Create Account</u> </NavLink>

        </CardFooter>
      </Card>
    </div>
     );
}
 
export default Login;