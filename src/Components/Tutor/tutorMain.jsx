import {useEffect, useState} from 'react'
import {motion} from 'framer-motion';
import ClockInPopup from './clockInPopup';
import GroupCheckIn from './groupCheckIn';
import GroupCheckOut from './groupCheckOut';


const TutorMain = ({closePopup}) => {

    const [clockInPopup,setClockInPopup] = useState(false);
    const [groupCheckInPopup,setGroupCheckInPopup] = useState(false);
    const [groupCheckOutPopup,setGroupCheckOutPopup] = useState(false);

    useEffect(() => console.log("Clock in Popup: " + clockInPopup),[clockInPopup])
    return ( 
        <div className="z-50 absolute w-full h-[100vh] bg-black/50 top-0">
            {groupCheckInPopup && !groupCheckOutPopup && !clockInPopup &&
                <GroupCheckIn close={() => setGroupCheckInPopup(false)}/>
            }
            {groupCheckOutPopup && !groupCheckInPopup && !clockInPopup &&
                <GroupCheckOut close={() => setGroupCheckOutPopup(false)}/>
            }
            {clockInPopup && !groupCheckInPopup && !groupCheckOutPopup &&
                <>
                <ClockInPopup close={() => setClockInPopup(false)}/>
                </>
            }
            {!clockInPopup && !groupCheckInPopup && !groupCheckOutPopup &&
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity:1,scale:1}}
                    transition={{
                        duration: 0.2,
                        ease: "linear"
                    }}
                    className='relative bg-[black] m-auto top-[30%] w-1/2 bg-black/90 p-10 border-solid border-2 border-mccd-gold rounded-xl flex flex-col gap-1'
                >

                    <button className="absolute right-10 bg-red-500 font-bold w-[4rem] border-solid border-black border-2 rounded hover:bg-red-600" onClick={() => closePopup()}>Close</button>

                    <h2 className='font-extrabold text-mccd-gold text-3xl tracking-wide italic text-left my-10 ms-10'>What Would You Like To Do?</h2>
                    
                    <ul className='flex flex-row flex-wrap gap-2 justify-center items-center text-white'>
                        <li 
                            className='text-sm font-bold bg-mccd-blue py-3 px-5 m-1 border border-solid border-mccd-gold-dark border-4 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light hover:cursor-pointer'

                            onClick={() => setClockInPopup(true)}
                        >
                            Tutor Clock In/Out
                        </li>

                        <li 
                            className='text-sm font-bold bg-mccd-blue py-3 px-5 m-1 border border-solid border-mccd-gold-dark border-4 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light hover:cursor-pointer'
                            onClick={() => setGroupCheckInPopup(true)}    
                        >
                            Group Table Check In
                        </li>
                        <li 
                            className='text-sm font-bold bg-mccd-blue py-3 px-5 m-1 border border-solid border-mccd-gold-dark border-4 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light hover:cursor-pointer'
                            onClick={() => setGroupCheckOutPopup(true)}    
                        >
                            Group Table Check Out
                        </li>

                        <li className='text-sm font-bold bg-mccd-blue py-3 px-5 m-1 border border-solid border-mccd-gold-dark border-4 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light hover:cursor-pointer'>
                            Tutor Break Log
                        </li>

                        <li className='text-sm font-bold bg-mccd-blue py-3 px-5 m-1 border border-solid border-mccd-gold-dark border-4 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light hover:cursor-pointer'>
                            View Clocked In Tutors
                        </li>
                    </ul>
                </motion.div>            

            }
        </div>
     );
}
 
export default TutorMain;