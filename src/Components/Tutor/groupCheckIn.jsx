
import {useState, useRef} from 'react';
import {motion} from 'framer-motion';
import useFetch from '../../hooks/useFetch'
import baseUrl from '../../baseUrl';

const GroupCheckIn = ({close}) => {
    const [availableTutors,loadingTutors,tutorError] = useFetch(baseUrl + '/tutors/available')
    const [groupTables,loadingGroupTables,error] = useFetch(baseUrl + "/grouptables")
    const [tutorId, setTutorId] = useState();
    const [tableId,setTableId] = useState();
    const [loading,setLoading] = useState(false);


    const formRef = useRef();

    const handleCheckIn = (e) => {
        e.preventDefault();

        const option = '0';

        fetch(baseUrl + "/groupTables/clock",{
            method: "PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                option,
                groupTableId:tableId,
                tutorId
            })
        })
        .then(res => res.json())
        .then(data => {
            setTutorId()
            setTableId();
            close();
        })
        .catch(err => setErr(err.message))

        
    }
    return(

        //Design flaw as I can't clock out tutors that have been clocked in, they disapear from select tutor selector. maybe move check out to different comp or modify the parameters of the form.
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
            {(error || tutorError )&&
                <div>error</div>
            }
            {(loadingGroupTables && loadingTutors || loading) &&
                <div className="w-[250px] h-[135px] flex justify-center items-center">
                    <div className="w-8 h-8 border-mccd-blue border-t-mccd-gold border-4 rounded-full animate-spin"/>
                </div>
            }
            {groupTables && availableTutors &&  !loading &&        
                <form ref={formRef} className='flex flex-col' action="submit">
                    <h2 className='font-extrabold my-5 text-xl tracking-wide underline text-mccd-gold'>Group Table Check In</h2>

                    <label className='text-left'>Select Tutor:</label>
                    <select className="text-black" onChange={e => setTutorId(e.target.value)}>
                        <option value="">- - -</option>
                        {availableTutors.tutors.map((tutor,indx) => {
                            return(
                                <option key={indx} value={tutor._id}>
                                    {tutor.firstName} {tutor.lastName}
                                </option>
                            )
                        })}
                    </select>

                    <label className='text-left'>Select Group Table: </label>
                    <select className="text-black" onChange={e => setTableId(e.target.value)}>
                        <option value="">- - -</option>
                        {groupTables.map((table,indx) => {
                            return(
                                <option key={indx} value={table._id}>
                                    {table.name}
                                </option>
                            )
                        })}
                    </select>

                    <button className="text-sm font-bold bg-mccd-blue py-3 px-5 mt-5 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light" onClick={(e) => handleCheckIn(e)}>Check In</button>
                </form>
            } 
        </motion.div>
    )
}

export default GroupCheckIn