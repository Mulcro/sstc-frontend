
import {useState,useRef} from 'react';
import {motion} from 'framer-motion';
import baseUrl from '../../baseUrl';

const ClockInPopup = ({close}) => {
    const [studentId, setStudentId] = useState();
    const studentIdRef = useRef();

    const handleCheckIn = (e) => {
        e.preventDefault();
        const option = e.target.value;
        console.log(e)
        fetch(baseUrl + "/tutors",{
            method: "PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                option,
                studentId
            })
        })
        .then(res => {
            if(res.ok){
                return res.json()
            }
            return res.json().then(err => new Error(err.message))
        })
        .then(data => {
            console.log("here: " + data)
            setStudentId()
            close();
        })
        .catch(err => console.log(err.message))

        
    }
    return(
        <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity:1,scale:1}}
            transition={{
                duration: 0.2,
                ease: "linear"
            }}
                className='z-100 relative top-[25%] w-[35vw] h-[40vh] m-auto bg-[rgba(0,0,0,1)] flex flex-col justify-center items-center border border-mccd-gold rounded-xl border-2 text-white'
        >
            <button className='absolute right-0 top-0 m-3 px-1 bg-red-600 font-bold text-black border border-black hover:bg-red-700' 
                onClick={() => close()}
            >X
            </button>
            <h2 className='font-extrabold my-5 text-xl tracking-wide underline text-mccd-gold'>Check In & Check Out</h2>
            <form ref={studentIdRef} className='flex flex-col' action="submit">
                <label className='text-left'>Student ID:</label>
                <input className='border border-mccd-gold-dark border-2 text-black' type="number" onChange={e => setStudentId(e.target.value)}/>
                <div className='mt-5 grid grid-cols-2 gap-2 my-3'>
                    <button value={1} className="text-sm font-bold bg-mccd-blue py-3 px-5 m-1 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light" onClick={e => handleCheckIn(e)}>Check In</button>
                    <button value={2} className="text-sm font-bold bg-mccd-blue py-3 px-5 m-1 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light" onClick={e => handleCheckIn(e)}>Check Out</button>
                </div>
            </form>
        </motion.div> 
    )
}

export default ClockInPopup