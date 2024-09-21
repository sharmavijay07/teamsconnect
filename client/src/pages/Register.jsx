import { useContext } from 'react';
import {Alert,Button, Form,Row,Col,Stack} from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
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

const Register = () => {
    const {registerInfo,updateRegisterInfo,registerUser,registerError,isRegisterLoading} = useContext(AuthContext)
      return ( 
        // <>
        // <Form onSubmit={registerUser}>  
        //     <Row style={{
        //         height:'100vh',
        //         justifyContent:'center',
        //         paddingTop:'20%'
        //     }}>
        //         <Col xs={6}>
        //         <Stack gap={3}>
        //             <h2>Register</h2>
        //             <Form.Control type='text' placeholder='Enter name' onChange={(e)=>updateRegisterInfo({...registerInfo,name:e.target.value})}/>
        //             <Form.Control type='email' placeholder='Enter email' onChange={(e)=>updateRegisterInfo({...registerInfo,email:e.target.value})}/>
        //             <Form.Control type='password' placeholder='Enter password' onChange={(e)=>updateRegisterInfo({...registerInfo,password:e.target.value})}/>
        //             <Button variant='primary' type='submit'>
        //                 {isRegisterLoading?'Creating your account':"Register"}
        //             </Button>
        //             {
        //                 registerError?.error && <Alert variant='danger'><p>{registerError?.message}</p></Alert>
        //             }
        //         </Stack>
        //         </Col>
        //     </Row>
        // </Form>
        // </>

        <div className="flex flex-col justify-center items-end h-90vh mt-20">
      <img src="/src/assets/login.png" className="absolute bottom-0 left-0 -z-50" alt="a person working on his desk" />
      <Card className="w-[400px] mr-20 sm:mr-20 md:mr-25 lg:mr-60 border-0 shadow-none bg-white rounded-5">
        <CardHeader className="items-center" >
          <CardTitle>Register</CardTitle>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={registerUser}>
            <div className="grid w-full items-center">
            <div className="flex flex-col space-y-1.5">
                <Label className="relative top-5 w-1/5 ml-4 bg-white p-2" htmlFor="name">Name</Label>
                <Input className="rounded" id="name" type='text' placeholder='Enter name' onChange={(e)=>updateRegisterInfo({...registerInfo,name:e.target.value})} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="relative top-5 w-1/5 ml-4 bg-white p-2" htmlFor="name">E-mail</Label>
                <Input className="rounded" id="name" type='email' placeholder='Enter email' onChange={(e)=>updateRegisterInfo({...registerInfo,email:e.target.value})} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="relative top-5 w-1/4 ml-4 bg-white p-2" htmlFor="framework">Password</Label>
                <Input className="rounded" id="password" type='password' placeholder='Enter password' onChange={(e)=>updateRegisterInfo({...registerInfo,password:e.target.value})} />
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
                 isRegisterLoading?'Creating your account':"Register"
           }
           </Button>
              </div>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
         
           {
                        registerError?.error && <Alert variant='danger'><p>{registerError?.message}</p></Alert>
                     }
        </CardFooter>
        
        <CardFooter>
                    <NavLink to='/login'><u className='text-xl'>Login Instead</u></NavLink>

        </CardFooter>
      </Card>
    </div>

     );
}
 
export default Register;