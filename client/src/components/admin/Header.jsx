import React from "react";
import {BsFillBellFill,BsFillEnvelopeFill,BsPersonCircle,BsSearch,BsJustify} from 'react-icons/bs'


function Header(){
    return(
        <header className="w-full header bg-blue-200 flex">
            <div className="menu-icon">
                <BsJustify className='icon'/>
            </div>
            <div className="header-left">
            {/* <Input
              className="border rounded-3 p-2 gap-2 bg-white border-gray-200"
              type="text"
              placeholder="Search Groups"/> */}
                <BsSearch className="icon"/>
            </div>
            <div className="header-right flex p-2 gap-5">
                <BsFillBellFill    className="icon"/>
                <BsFillEnvelopeFill  className="icon"/>
                <BsPersonCircle  className="icon"/>
            </div>
        </header>
    )
}

export default Header