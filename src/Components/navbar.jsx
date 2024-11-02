import {useState,useEffect} from 'react';
import { FaUserClock } from "react-icons/fa";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { IoIosLogIn } from "react-icons/io";
import {Link, useLocation} from 'react-router-dom';
import TutorMain from './Tutor/tutorMain';



const Navbar = () => {

    const [displayTutorManagement,setTutorManagementPopup] = useState(false);
    const location = useLocation()

    console.log(`Endpoint: + ${location.pathname}`)
    return (
        <nav className="z-0 flex justify-center items-center sticky bg-transparent h-[15vh] w-full">
            {displayTutorManagement &&
                <TutorMain closePopup={() => setTutorManagementPopup(false)}/>
            }
            <ul className='flex gap-5 flex-row font-bold text-white bg-black/40 rounded p-5 border border-white'>
                <li  onClick={() => setTutorManagementPopup(true)} className='relative flex flex-col pr-4 group border-r border-white border-solid hover:cursor-pointer'>
                    <div className='flex flex-row items-center gap-3 py-2' >
                        <FaUserClock size={20}/>
                        Tutor Management
                    </div>
                    <div className='absolote bg-white bottom-0 left-0 h-[2.5px] w-0 trasition-all duration-300 group-hover:w-full'/>
                </li>
                <Link to='/' className='relative flex flex-col pl-[2rem] pr-[3rem] group border-r border-white border-solid hover:cursor-pointer'>
                    
                    <div className='flex flex-row items-center gap-3 py-2' >
                        <IoMdHome size={20}/>
                        Home
                    </div>
                        <div className={location.pathname === '/' ? 'absolote bg-white h-[2.5px] w-full' : 'absolote bg-white bottom-0 left-0 h-[2.5px] w-0 trasition-all duration-300 group-hover:w-full'}/>
                </Link>
                <Link to='/sessions' className='relative flex flex-col pr-4 group hover:cursor-pointer'>
                    <div className='flex flex-row items-center gap-3 py-2' >
                        <LiaChalkboardTeacherSolid size={25} />
                        Session Management
                    </div>
                    <div className={location.pathname === '/sessions' ? 'absolote bg-white h-[2.5px] w-full' : 'absolote bg-white bottom-0 left-0 h-[2.5px] w-0 trasition-all duration-300 group-hover:w-full'}/>
                </Link>
            </ul>

        </nav>
     );
}
 
export default Navbar;