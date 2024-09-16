import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
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

export function CardWithForm() {
  return (
    <div className="flex flex-col justify-center items-end h-screen">
      <img src="/src/assets/login.png" className="absolute bottom-0 left-0 -z-50" alt="a person working on his desk" />
      <Card className="w-[400px] mr-20 sm:mr-20 md:mr-25 lg:mr-60 border-0 shadow-none">
        <CardHeader className="items-center" >
          <CardTitle>Login</CardTitle>
          <CardTitle>Welcome Back !</CardTitle>
        </CardHeader>
        <CardContent>
          <form >
            <div className="grid w-full items-center">
              <div className="flex flex-col space-y-1.5">
                <Label className="relative top-5 w-1/5 ml-4 bg-white p-2" htmlFor="name">E-mail</Label>
                <Input id="name" placeholder="Name of your project" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="relative top-5 w-1/4 ml-4 bg-white p-2" htmlFor="framework">Password</Label>
                <Input id="password" placeholder="Enter passsword" />
              </div>
              <br />
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="w-4/6 bg-black rounded-full">Login</Button>
        </CardFooter>
        <CardFooter>
          <a href="#"> Trouble Logging in ?</a>
        </CardFooter>
        <CardFooter>
          <a href="#">New User? Create an account</a>

        </CardFooter>
      </Card>
    </div>
  )
}
