import {useEffect, useRef, useState, useMemo} from 'react';
import useFetch from '../../hooks/useFetch';
import SessionCard from './sessionCard';
import Popup from './popup';
import {useSelector, shallowEqual} from 'react-redux';
import baseUrl from '../../baseUrl';

let counter = 0;


//TO-DO:Connect magnetic card readers to this and allow users to check in with their ID cards
const Session = () => {
    console.log('Rerendered: ' + (counter++));

    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("")
    const [studentId, setStudentId] = useState();
    const [querySubject,setQuerySubject] = useState("");

    //Not sure what these 2 are for
    const [err,setErr] = useState(null)
    const [loading,setLoading] = useState()
    //

    const [availableTutors,setAvailableTutors] = useState([]);
    const [clockedInTutors,setClockedInTutors] = useState([]);

    const [tutorId, setTutorId] = useState();
    const [sessionType, setSessionType] = useState();

    const [tutorPopup,setTutorPopup] = useState(false);
    const [queuePopup,setQueuePopup] = useState(false);

    const [subjectsData, subjectsLoading, subjectsError] = useFetch(baseUrl + '/subjects');
    
    const subjectRef = useRef();

    const activeSessions = useSelector(state => {
        return state.sessions;
    })

    //Not supposed to be here, maybe add to redux global state so I can check tutors in and out anywhere in application
    const handleCheckIn = (e) => {
        e.preventDefault();
        const option = e.target.value;

        fetch(baseUrl + "/tutors/",{
            method: "PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                option,
                studentId
            })
        })
        .then(res => res.json())
        .then(data => {
            studentIdRef.reset();
            setStudentId()
            })
        .catch(err => setErr(err.message))

        
    }

    const handleFindAvailableTutors = (e) => {
        e.preventDefault();

        fetch(baseUrl + "/tutors/available",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                option: querySubject
            })
        })
        .then(res => {
            setLoading(true);
            if (res.ok){
                return res.json()
            }
            throw new Error()
        })
        .then(data => {
            setAvailableTutors(data);
            setLoading(false);
            setTutorPopup(true);
        })
        .catch(err => {
            setLoading(false);
            setErr(err.message)
        })

    }

    const hadnleFindClockedInTutors = (e) => {
        e.preventDefault();

        fetch(baseUrl + "/tutors/clockedIn",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                option: querySubject
            })
        })
        .then(res => {
            setLoading(true);
            if (res.ok){
                return res.json()
            }
            throw new Error()
        })
        .then(data => {
            setClockedInTutors(data);
            setLoading(false);
            setQueuePopup(true);
        })
        .catch(err => {
            setLoading(false);
            setErr(err.message)
        })

    }

    const handleCreateSession = (e) => {
        e.preventDefault();

        fetch(baseUrl + "/sessions", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                type: sessionType,
                tutorId,
                studentId,
                studentFirstName,
                studentLastName,
                subjectId: querySubject,
                startTime: Date.now()
            })
        }).
        then(res => {
            if(res.ok)
                return res.json()
            else{
                return res.json().then(err => new Error(err.message))
            }
        })
        .then(() => {
            setTutorPopup(false);
        })
        .catch(
            err => {
                setErr(err.message)
            }
        )
    }

    //TO-Do: If no tutors are avaialable make it imporisble to get to popup screen
    const handleAddSessionToQueue = (e) => {
        e.preventDefault();

        fetch(baseUrl + "/sessions/queue", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                type: sessionType,
                tutorId,
                studentId,
                studentFirstName,
                studentLastName,
                subjectId: querySubject,
            })
        }).
        then(res => {
            if(res.ok)
                return res.json()
            else
                return res.json().then(
                    err =>  new Error(err.message)
                )
        })
        .then(data => {
            setQueuePopup(false);
        })
        .catch(
            err => {
                console.log(err.message);
                setErr(err.message)
            }
        )
    }

    //TO-DO: make sure this doesnt change the session to inactive so the desk worker can choose to end the session in instead of it being automatically terminated.

    const handleEndSession = (sessionId) => {
        
        fetch(`http://localhost:5000/sessions/end/${sessionId}`, {
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(res => {
            if(res.ok)
                return;
            else{
                return res.json().then(err => new Error(err.message))
            }
        })
        .catch(err => {
            setErr(err.message)
        })
    }

    useEffect(() => {
        if(subjectsData)
            subjectRef?.current.focus();
    }, [subjectsData]);
    

    return ( 
        <>
        {subjectsLoading && !subjectsError && !subjectsData &&
            <div>Loading...</div>
        }
        {subjectsError &&
            <div className=' my-2 mx-auto p-3 bg-black border-2 border-orange-400 rounded-xl shadow-2xl w-[20vw]'>
                <p className=' text-orange-400 text-sm underline'> <span className='font-bold'>Error:</span> {subjectsError}</p>

                <p className='my-2 text-orange-400'>Please refresh page to try again</p>
            </div>
        }
        {subjectsData &&
            <div className='flex flex-col justify-center items-center'>
                <div className='flex flex-col gap-2 py-5 px-3 my-5 bg-gray-300'>
                    <h2>Check In & Check Out</h2>
                    <form className='flex flex-col' action="submit">
                        <label className='text-left' htmlFor="">Student ID</label>
                        <input type="number" onChange={e => setStudentId(e.target.value)}/>

                        <div className='grid grid-cols-2 gap-2 my-3'>
                            <button value={1} className="p-1 bg-gray-600 rounded-xl border-2 border-black border-solid hover:bg-gray-700 text-white font-bold" onClick={e => handleCheckIn(e)}>Check In</button>
                            <button value={2} className="p-1 bg-gray-600 rounded-xl border-2 border-black border-solid hover:bg-gray-700 text-white font-bold" onClick={e => handleCheckIn(e)}>Check Out</button>
                        </div>
                    </form>
                </div>                
                <div>
                    <form className="flex flex-col justify-center items-center bg-black p-5 rounded-xl h-[25vh]" action='submit' >

                        <div className={(!querySubject) ? "block mt-5 mb-2 px-6 py-2 rounded-xl bg-slate-300/60 border-2 border-white" : "hidden" }>
                            <p className='text-black font-bold'>Select a Subject</p>
                        </div>
                        <select ref={subjectRef} onChange={e => setQuerySubject(e.target.value)} className='text-black px-5 py-1 rounded-xl border-slate-600 border-2'>
                            <option value="">--Select Subject</option>
                            {subjectsData.subjects.map((subject, id) => {
                                return (
                                    <option key={id} value={subject._id}>{subject.name}</option>
                                )
                            })}
                        </select>
                        
                        <div className="flex flex-row gap-2 text-white">
                            <button className={`my-[1rem] py-1 px-3 bg-slate-500 border border-white rounded-xl  focus:border-2 disabled:border-none disabled:bg-opacity-40 disabled:text-slate-200/20 ${!querySubject ? "" : "hover:bg-slate-600"}`} disabled={(!querySubject || (activeSessions.length < 1)) ? true : false} onClick={(e) => hadnleFindClockedInTutors(e)}>Add student to Queue</button>
                            <button className={`my-[1rem] py-1 px-3 bg-slate-500 border border-white rounded-xl  focus:border-2 disabled:border-none disabled:bg-opacity-40 disabled:text-slate-200/20 ${!querySubject ? "" : "hover:bg-slate-600"}`} disabled={!querySubject ? true : false} onClick={e => handleFindAvailableTutors(e)}>Look for available tutors</button>
                        </div>
                    

                    </form>
                    
                    <div>
                        <h3>Active Sessions</h3>
                        <div className="flex flex-col items-center justify-center gap-4">
                            {activeSessions.error &&
                                <div className='p-3 bg-black border-2 border-orange-400 rounded-xl shadow-2xl '>
                                    <p className=' text-orange-400 text-sm '>{activeSessions.error}</p>
                                </div>
                            }
                            { activeSessions.data &&
                                <div className="flex flex-row items-center justify-center gap-4">
                                    {activeSessions.data.map(
                                        (session,idx) => {
                                            return (
                                                <SessionCard  session={session} key={idx} handleEndSession={handleEndSession}/>
                                            )
                                        }
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                    </div>
            </div>
        }
        {tutorPopup &&
           <Popup err={err} dataType={0} handleFunction={handleCreateSession} setSessionType={setSessionType} setStudentId={setStudentId} setStudentFirstName={setStudentFirstName} setStudentLastName={setStudentLastName} setTutorId={setTutorId} data={availableTutors} setPopup={setTutorPopup}/>
        }
        {queuePopup &&
            <Popup err={err} dataType={1} handleFunction={handleAddSessionToQueue} setSessionType={setSessionType} setStudentId={setStudentId} setStudentFirstName={setStudentFirstName} setStudentLastName={setStudentLastName} setTutorId={setTutorId} data={clockedInTutors} setPopup={setQueuePopup}/>
        }
        </>
     );
}
 
export default Session;