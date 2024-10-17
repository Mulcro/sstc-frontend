import {useState,useEffect} from 'react';
import { FaUserClock } from "react-icons/fa";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";
import {Link} from 'react-router-dom';
import TutorMain from './Tutor/tutorMain';


const Navbar = () => {

    const [displayTutorManagement,setTutorManagementPopup] = useState(false);
    
    return (
        <nav className="z-0 flex justify-center items-center sticky bg-transparent h-[15vh] w-full">
            {displayTutorManagement &&
                <TutorMain closePopup={() => setTutorManagementPopup(false)}/>
            }
            <ul className='flex gap-5 flex-row font-bold text-white bg-black/40 rounded p-5 border border-white'>
                <li  onClick={() => setTutorManagementPopup(true)} className='relative flex flex-row gap-3 items-center group border-r py-2 pr-5 border-white border-solid hover:cursor-pointer'>
                    <FaUserClock size={20}/>
                    <div>
                        Tutor Management
                        <div className='absolote bg-white bottom-0 left-0 h-[2.5px] w-0 trasition-all duration-300 group-hover:w-full'/>
                    </div>
                </li>
                <Link to='/sessions' className='relative flex flex-row items-center gap-3 group py-2 pr-5 border-r border-white border-solid hover:cursor-pointer'>
                    <LiaChalkboardTeacherSolid size={25} />
                    <div>
                        Session Management
                        <div className='absolote bg-white bottom-0 left-0 h-[2.5px] w-0 trasition-all duration-300 group-hover:w-full'/>
                    </div>
                </Link>
                <Link to='/admin' className='relative flex flex-row gap-3 items-center group py-2 px-4 hover:cursor-pointer'>
                    <MdOutlineAdminPanelSettings size={25}/>
                    <div>
                        Admin
                        <div className='absolote bg-white bottom-0 left-0 h-[2.5px] w-0 trasition-all duration-300 group-hover:w-full'/>
                    </div>
                </Link>

            </ul>

            <div className='flex flex-row gap-3 bg-mccd-blue p-5 font-bold text-white absolute right-0 group mr-10 border border-solid border-white rounded-lg shadow-lg'>
                    <IoIosLogIn size={25}/>
                    <div>
                        Login/Out
                        <div className='absolote bg-white bottom-0 left-0 h-[2.5px] w-0 trasition-all duration-300 group-hover:w-full'/>
                    </div>
            </div>

        </nav>
     );
}
 
export default Navbar;