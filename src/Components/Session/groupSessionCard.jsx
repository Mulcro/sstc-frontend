import {useState,useEffect} from 'react';
import baseUrl from '../../baseUrl';

const GroupSessionCard = ({table}) => {

    const [activeSessions, setActiveSessions] = useState([]);
    const [selectedSessions, setSelectedSession] = useState(new Set());

    useEffect(() => {
        console.log(selectedSessions)
    }, [selectedSessions])
    
    const handleCheckBox = (e) => {
        
        if(e.target.checked){
            setSelectedSession(prevSelectedSessions => {
                const newSet = new Set(prevSelectedSessions);
                newSet.add(e.target.value);
                return newSet;
            })            
        }
        else{
            setSelectedSession(prevSelectedSessions => {
                const newSet = new Set(prevSelectedSessions);
                newSet.delete(e.target.value);
                return newSet;
            })
        }
        
    }

    const fetchActiveSessions = () => {
        fetch(baseUrl + `/sessions/group/${table._id}`)
        .then(res => {
            if(res.ok)
                return res.json()
            else{
                return res.json().then(err => new Error(err.message))
            }
        })
        .then(data => {
            setActiveSessions(data)
        })
        .catch(err => {
            console.log(JSON.stringify(err))
        })
    }    

    const handleEndSession = () => {
        console.log("hit")
        selectedSessions.forEach( value => {
            console.log(`Value: ${value}`)
            fetch(baseUrl + `/sessions/group/${value}`,{
                method:'PATCH'
            })
            .then(res => {
                if(res.ok)
                    return res.json()
                else{
                    return res.json().then(err => new Error(err.message))
                }
            })
            .then(data => {
                console.log("Session Ended")
                fetchActiveSessions();
            })
            .catch(err => {
                console.log(err)
            })

            selectedSessions.delete(value);
        })
    }
    

    useEffect(() => {
        fetchActiveSessions()

        //Temporarily the case that this refreshes every second, but hopefully I can implement a redux slice for the group session/table too
        const timerId = setInterval(() => {fetchActiveSessions()},1000);

        return () => clearInterval(timerId);
    },[])


    return ( 
        <div className="flex flex-col justify-center items-center bg-black text-white border border-2 border-mccd-gold rounded-lg p-5">
        
            <h3 className="underline font-bold tracking-wide mb-5" >{table.name}</h3>

            <div className='flex flex-col items-center'>
                <p>Active Tutors:</p>
                {table.tutors.length > 0 &&
                    <ul className="text-green-300">
                        {table.tutors.map(
                            (tutor,idx) => {
                                return(
                                    <li key={idx}>{tutor.firstName} {tutor.lastName}</li>
                                )
                            }
                        )}
                    </ul>
                }
                {table.tutors.length === 0 &&
                    <p className="text-orange-200">No Active Tutors</p>
                }
            </div>

            <div className="flex flex-col justify-center items-center">

                {/* Maybe I should fetch this seperately, need to work on backend */}
                <p>Active Sessions:</p>
                {activeSessions.length > 0 &&
                    <ul className="text-green-300">
                        {activeSessions.map(
                            (session,idx) => {
                                return(
                                    <div className="flex flex-row items-center justify-center gap-2" key={idx}>
                                        <input type="checkbox" onChange={(e) => handleCheckBox(e)} value={session._id}/>
                                        <p>{session.studentId.firstName} {session.studentId.lastName}</p>
                                    </div>
                                )
                            }
                        )}
                    </ul>
                }
                {activeSessions.length === 0 &&
                    <p className="text-orange-200">No Active Sessions</p>
                }
            </div>
            
            {selectedSessions.size > 0 && activeSessions.length > 0 &&
                <button className='bg-mccd-blue px-1 my-1 mx-1 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light"' onClick={() => handleEndSession()}>End Session</button>
            }
        </div>
     );
}
 
export default GroupSessionCard;