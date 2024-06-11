import {useEffect, useRef, useState} from 'react';
import useFetch from '../../hooks/useFetch';
import SessionCard from './sessionCard';
import Popup from './popup';

//TO-DO:Connect magnetic card readers to this and allow users to check in with their ID cards
const Session = () => {
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("")
    const [studentId, setStudentId] = useState();
    const [querySubject,setQuerySubject] = useState("");

    const [err,setErr] = useState(null)
    const [loading,setLoading] = useState()
    const [availableTutors,setAvailableTutors] = useState([]);
    const [clockedInTutors,setClockedInTutors] = useState([]);

    const [tutorId, setTutorId] = useState();
    const [sessionType, setSessionType] = useState();

    const [tutorPopup,setTutorPopup] = useState(false);
    const [queuePopup,setQueuePopup] = useState(false);

    const [activeSessions, setActiveSessions] = useState();

    const [subjectsData, subjectsLoading, subjectsError] = useFetch('http://localhost:5000/subjects');
    
    const studentIdRef = useRef();



    const handleCheckIn = (e) => {
        e.preventDefault();
        const option = e.target.value;

        fetch("http://localhost:5000/tutors/",{
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

        fetch("http://localhost:5000/tutors/available",{
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

        fetch("http://localhost:5000/tutors/clockedIn",{
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

    function getTimeLeft(timeout) {
        return Math.ceil((timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000);
    }

    //Think it's better to have timer in the sessionCard itself
    // const setTimer = (sessionId) => {
    //     setTimeout(() => {
    //         fetch(`http://localhost:5000/sessions/end/${sessionId}`,{
    //             method:"PATCH",
    //             headers:{
    //                 "Content-Type":"application/json"
    //             }
    //         })
    //         .then(res => {
    //             if(res.ok)
    //                 return res.json()
    //             throw new Error()
    //         })
    //         .then(data => console.log(data))
    //         .catch(err => {
    //             console.log(err);
    //             setErr(err.message)
    //     })
    //     },2*60*1000)
    // }
    

    const handleCreateSession = (e) => {
        e.preventDefault();

        fetch("http://localhost:5000/sessions", {
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
            else
                throw new Error(`${res}`)
        })
        .then(data => {
            // setTimer(data.session._id);
            setTutorPopup(false);
            handleFetchActiveSessions();
        })
        .catch(
            err => {
                console.log(err);
                setErr(err)
            }
        )
    }

    const handleAddSessionToQueue = (e) => {
        e.preventDefault();

        fetch("http://localhost:5000/sessions/queue", {
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
                    err => {throw new Error(err.message)}
                )
        })
        .then(data => {
            //This shouldn't be here
            // setTimer(data.session._id);
            setTutorPopup(false);
            handleFetchActiveSessions();
        })
        .catch(
            err => {
                console.log(err.message);
                setErr(err.message)
            }
        )
    }


    //Disable if there's an error initially while fetching data, or maybe switch to trying to fetch the data again instaed of refreshing for sessions
    const handleFetchActiveSessions = () => {
        fetch("http://localhost:5000/sessions/active")
        .then(res => {
            if(res.ok) return res.json()
            throw new Error()
        })
        .then(data => {
            console.log(data);
            setActiveSessions(data)})
        .catch(err => setErr(err.message))
    }

    const handleEndSession = (sessionId) => {
        
        fetch(`http://localhost:5000/sessions/end/${sessionId}`, {
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(res => {
            if(res.ok)
                return handleFetchActiveSessions();
            throw new Error()
        })
        .catch(err => {
            setErr(err.message)
        })
    }
    

    useEffect(()=> {

        //TO-DO: Modify this funtion and backend to ping the backend and ensure the sessions are still active

        //TO-DO: make sure this doesnt change the session to inactive so the desk worker can choose to end the session in instead of it being automatically terminated.

        //meaning I probably have to modify the tutor model and the frontend session display to not disapear when the time is up. Rather I should have the tutor be marked as avaialable but the session on going, maybe with a status of; time up but ongoing

        handleFetchActiveSessions();

        const fetchActiveSessionInterval = setInterval(() => {
            handleFetchActiveSessions()
        },0.2 * 60 * 1000)

        return () => clearInterval(fetchActiveSessionInterval);
    },[])

    return ( 
        <>
        {subjectsLoading &&
            <div>Loading...</div>
        }
        {subjectsError &&
            <div>Something went wrong...</div>
        }
        {subjectsData &&
            <div className='flex flex-col justify-center items-center'>
                <div className='flex flex-col gap-2 py-5 px-3 my-5 bg-gray-300'>
                    <h2>Check In & Check Out</h2>
                    <form className='flex flex-col' action="submit">
                        <label className='text-left' htmlFor="">Student ID</label>
                        <input ref={studentIdRef} type="number" onChange={e => setStudentId(e.target.value)}/>

                        <div className='grid grid-cols-2 gap-2 my-3'>
                            <button value={1} className="p-1 bg-gray-600 rounded-xl border-2 border-black border-solid hover:bg-gray-700 text-white font-bold" onClick={e => handleCheckIn(e)}>Check In</button>
                            <button value={2} className="p-1 bg-gray-600 rounded-xl border-2 border-black border-solid hover:bg-gray-700 text-white font-bold" onClick={e => handleCheckIn(e)}>Check Out</button>
                        </div>
                    </form>
                </div>                
                <div>
                    <form className="flex flex-col justify-center items-center bg-black p-5 rounded-xl text-white" action='submit' >
                        {/* <label htmlFor="">Type</label>
                        <input type="text" />

                        <label htmlFor="">Student Id</label>
                        <input onChangetype="number" /> */}

                        <label htmlFor="">Subject</label>
                        <select onChange={e => setQuerySubject(e.target.value)} className='text-black'>
                            <option value="">--Select Subject</option>
                            {subjectsData.subjects.map((subject, id) => {
                                return (
                                    <option key={id} value={subject._id}>{subject.name}</option>
                                )
                            })}
                        </select>
                        
                        <div className="flex flex-row gap-2">
                            <button onClick={(e) => hadnleFindClockedInTutors(e)}>Add student to Queue</button>
                            <button className="p-2 rounded-l text-white" onClick={e => handleFindAvailableTutors(e)}>Look for available tutors</button>
                        </div>
                        

                    </form>
                    
                    <div>
                        <h3>Active Session</h3>
                        <button onClick={() => handleFetchActiveSessions()}>Refresh</button>
                        <div className="flex flex-row gap-4">
                            { activeSessions &&
                                activeSessions.sessions.map(
                                    (session,idx) => {
                                        return (
                                            <SessionCard handleFetchActiveSessions={handleFetchActiveSessions} session={session} idx={idx} handleEndSession={handleEndSession}/>
                                        )
                                    }
                                )
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