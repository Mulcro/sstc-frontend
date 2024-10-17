import {useEffect, useRef, useState, useMemo} from 'react';
import useFetch from '../../hooks/useFetch';
import SessionCard from './sessionCard';
import Popup from './popup';
import GroupSessionPopup from './groupSessionPopup';
import {useSelector, shallowEqual} from 'react-redux';
import baseUrl from '../../baseUrl';
import GroupSessionCard from './groupSessionCard';

let counter = 0;


//TO-DO:Connect magnetic card readers to this and allow users to check in with their ID cards
const Session = () => {
    
    // console.log("Re-render: " + counter++)
    const [students,setStudents] = useState(new Map());
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("");

    const [querySubject,setQuerySubject] = useState("");
    const [type,setType] = useState();

    //Not sure what these 2 are for
    const [err,setErr] = useState(null)
    const [loading,setLoading] = useState()

    const [availableTutors,setAvailableTutors] = useState([]);
    const [tutorsInIndvlSession,setTutorsInIndvlSession] = useState([]);
    const [groupTable,setGroupTable] = useState();

    const [tutorId, setTutorId] = useState();
    const [sessionType, setSessionType] = useState();
    const [sessionLanguage,setSessionLanguage] = useState();

    const [tutorPopup,setTutorPopup] = useState(false);
    const [queuePopup,setQueuePopup] = useState(false);
    const [groupPopup,setGroupPopup] = useState(false);

    const [groupTables, setGroupTables] = useState();

    const [subjectsData, subjectsLoading, subjectsError] = useFetch(baseUrl + '/subjects');

    const [languages, languagesLoading, languagesError] = useFetch(baseUrl + "/languages");
    
    const subjectRef = useRef();
    const sessionTypeRef = useRef();

    // useEffect(() => {
    //     console.log("Languages: " + JSON.stringify(languages))
    // },[languages])
    const activeSessions = useSelector(state => {
        // console.log("Active Sessions: "+ JSON.stringify(state.sessions))
        return state.sessions;
    })

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

    const handleFindTutorsInIndvlSession = (e) => {
        e.preventDefault();

        fetch(baseUrl + "/tutors/individualsession",{
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
            setTutorsInIndvlSession(data);
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
        const studentArr = Array.from(students.values());

        fetch(baseUrl + "/sessions", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                type: sessionType,
                tutorId,
                students: studentArr,
                subjectId: querySubject,
                language:sessionLanguage,
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
            subjectRef.current.value = "";
            sessionTypeRef.current.value = "";
            setQuerySubject("");
            setTutorPopup(false);
        })
        .catch(
            err => {
                setErr(err.message)
            }
        )
    }

    //TO-DO: Disable ability to queue sessions if there are no active sessions.
    const handleAddSessionToQueue = (e) => {
        e.preventDefault();

        const studentArr = Array.from(students.values());

        fetch(baseUrl + "/sessions/queue", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                type: sessionType,
                tutorId,
                students:studentArr,
                subjectId: querySubject,
                language: sessionLanguage
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
            subjectRef.current.value = "";
            sessionType.current.value = "";
            setQuerySubject("");
        })
        .catch(
            err => {
                console.log(err.message);
                setErr(err.message)
            }
        )
    }

    const findGroupTable = (e) => {
        e.preventDefault();

        fetch(baseUrl + '/grouptables/find',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                subject:querySubject
            })
        })
        .then(res => {
            if(res.ok)
                return res.json()
            else{
                return res.json().then(err => new Error(err.message))
            }
        })
        .then(data => {
            console.log("Group Table: " + JSON.stringify(data))
            setGroupTable(data)
            setGroupPopup(true)
        })
        .catch(err => {
            console.log(err)
        })
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
        const fetchGroupTables = () => {
            fetch(baseUrl + '/grouptables')
            .then(resp => {
                if(resp.ok) {
                    return resp.json()
                }
                return resp.json().then(err => new Error(err.message))
            })
            .then(data => {
                setGroupTables(data)
            })
            .catch(err => {
                setErr(err)
            })
        }

        const timerId = setInterval(fetchGroupTables,1000);

        return () => clearInterval(timerId);
        
    }, [])
    return ( 
        <>
            {(subjectsLoading && !subjectsError && !subjectsData) || (languagesLoading && !languages && !languagesError)  &&
                <div className='h-[80vh] m-auto'>Loading...</div>
            }
            {(subjectsError && languagesError) &&
                <div className=' h-[80vh] m-auto p-3 bg-black border-2 border-orange-400 rounded-xl shadow-2xl w-[20vw]'>
                    <p className=' text-orange-400 text-sm underline'> <span className='font-bold'>Error:</span> {subjectsError}</p>

                    <p className='my-2 text-orange-400'>Please refresh page to try again</p>
                </div>
            }
            {(subjectsData && languages && groupTables) &&
                <div className='here w-full h-[85vh] p-5 flex flex-col justify-center items-center rounded bg-gradient-to-l from-mccd-gold to-mccd-blue'>
                    <div id='sessionSection' className=' w-[70vw] scroll-smooth overflow-y-scroll h-full bg-white/60 p-20 rounded shadow-xl border border-double border-mccd-gold border-2 '>               
                            <form className=" flex flex-col justify-center items-center bg-black p-5 rounded-xl h-[35vh] w-[35vw] m-auto border border-2 border-mccd-gold" >

                                <div className={(!querySubject) ? "block mt-5 mb-2 px-6 py-1 rounded bg-mccd-blue-light border-2 border-mccd-gold-dark" : "hidden" }>
                                    {<p className='text-white'>
                                        Select a Subject
                                    </p>}
                                </div>

                                <select ref={subjectRef} onChange={e => setQuerySubject(e.target.value)} className='text-black px-5 rounded border-mccd-blue-light border-2'>
                                    <option value="">-- Select Subject --</option>
                                    {subjectsData?.subjects.map((subject, id) => {
                                        return (
                                            <option key={id} value={subject._id}>{subject.name}</option>
                                        )
                                    })}
                                </select>

                                <div className={(!type) ? "block mt-5 mb-2 px-6 py-1 rounded bg-mccd-blue-light border-2 border-mccd-gold-dark" : "hidden" }>
                                    {<p className='text-white'>
                                        Select Session Type
                                    </p>}
                                </div>

                                <select ref={sessionTypeRef} onChange={e => setType(e.target.value)} className='text-black px-5 rounded border-mccd-blue-light border-2'>
                                    <option value="">-- Select Session Type --</option>
                                    <option value={0}>One on One</option>
                                    <option value={1}>Group Table</option>
                                </select>
                                
                                { (type === "0") && 
                                    <div className="flex flex-row gap-2 text-white">
                                        <button className={`font-bold my-[1rem] py-1 px-3 bg-mccd-blue border border-mccd-gold-dark border-2 rounded  disabled:border-none transition-all ease-in-out duration-200 disabled:hidden disabled:text-slate-200/20 ${!querySubject ? "" : "hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue"}`} disabled={(!querySubject || (activeSessions.length < 1) || !type) ? true : false} onClick={(e) => handleFindTutorsInIndvlSession(e)}>Add student to Queue</button>
                                        <button className={`font-bold my-[1rem] py-1 px-3 bg-mccd-blue border border-mccd-gold-dark border-2 rounded transition-all ease-in-out duration-200 disabled:border-none disabled:hidden disabled:text-slate-200/20 ${!querySubject ? "" : "hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue"}`} disabled={(!querySubject || !type ) ? true : false} onClick={e => handleFindAvailableTutors(e)}>Look for available tutors</button>
                                    </div>
                                }

                                {(type === "1") &&
                                    <div>
                                        <button className={`text-white font-bold my-[1rem] py-1 px-3 bg-mccd-blue border border-mccd-gold-dark border-2 rounded transition-all ease-in-out duration-200 disabled:border-none disabled:hidden disabled:text-slate-200/20 ${!querySubject ? "" : "hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue"}`} disabled={(!querySubject || !type ) ? true : false} onClick={(e) => {
                                            findGroupTable(e)
                                        }} >
                                            Add to group session</button>
                                    </div>
                                }
                            

                            </form>
                            
                            <div >
                                <h3 className="p-4 font-bold underline " >Active Sessions</h3>
                                <div className="flex flex-row items-center justify-center gap-4">
                                    {activeSessions.error &&
                                        <div className='p-3 bg-black border-2 border-orange-400 rounded-xl shadow-2xl '>
                                            <p className=' text-orange-400 text-sm '>{activeSessions.error}</p>
                                        </div>
                                    }
                                    { activeSessions.data &&
                                        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                                            {activeSessions.data.map(
                                                (session,idx) => {
                                                    return (
                                                        <SessionCard  session={session} key={idx} handleEndSession={handleEndSession}/>
                                                    )
                                                }
                                            )}
                                        </div>
                                    }
                                    <div>
                                        <div className='flex flex-col flex-wrap justify-center items-center'>
                                            <div className='flex justify-center items-start gap-3'>
                                                {groupTables.map((table,idx) =>{
                                                    return(
                                                        <GroupSessionCard table={table} key={idx}/>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            }
            {tutorPopup &&
                <Popup firstName={studentFirstName} lastName={studentLastName} students={students} setStudents={setStudents} err={err} dataType={0} handleFunction={handleCreateSession} setSessionType={setSessionType} setStudentFirstName={setStudentFirstName} setStudentLastName={setStudentLastName} setSessionLanguage={setSessionLanguage} tutorId={tutorId} language={sessionLanguage} type={sessionType} setTutorId={setTutorId} data={availableTutors} setPopup={setTutorPopup} languageData={languages}/>
            }
            {queuePopup &&
                <Popup firstName={studentFirstName} lastName={studentLastName} students={students} setStudents={setStudents} err={err} dataType={1} handleFunction={handleAddSessionToQueue} setSessionType={setSessionType}  setStudentFirstName={setStudentFirstName} setStudentLastName={setStudentLastName} setSessionLanguage={setSessionLanguage} tutorId={tutorId} language={sessionLanguage} type={sessionType} setTutorId={setTutorId} data={tutorsInIndvlSession} setPopup={setQueuePopup} languageData={languages}/>
            }
            {groupPopup &&
                <GroupSessionPopup  subjectRef={subjectRef} sesionTypeRef={sessionTypeRef} subject={querySubject} resetType={() => setType(false)} table={groupTable} close={() => setGroupPopup(false)} languageData={languages}/>
            }
        </>
     );
}
 
export default Session;