import { useEffect, useState, useRef } from "react";
import baseUrl from '../../baseUrl';

const SessionCard = ({session,idx,handleEndSession}) => {
    //TO-DO: Start session page renders again briefly even though it shouldn't  
    //TO-DO: Add ability to press enter button to register form submissions
    //TO-DO: currTime becomes null when page is refreshed, maybe store in local memory
    const [loading,setLoading] = useState(false);
    const [currTime,setTimeLeft] = useState();
    const timerIdRef = useRef(null);

    useEffect(() => {
        const updateTime = () => {
            if(session.paused || session.extended || !session.startTime){
                return () => clearInterval(timerIdRef);
            }

            const endTime = new Date(session.expectedEnd);
            const roundedTime = Math.floor((endTime - Date.now())/1000);
            const timeLeft = Math.max(roundedTime, 0);

            setTimeLeft(timeLeft);

            if(timeLeft === 0){
                fetch(`${baseUrl}/sessions/end/${session._id}`,{
                    method:"PATCH",
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                .then(res => {
                    if(res.ok)
                        return res.json();
                    else{
                        return res.json().then(err => new Error(err.message))
                    }
                })
                .then(data => {
                    console.log(data)
                })
                .catch(err => {
                    setErr(err.message)
                })
            }
        }
        
        updateTime()
        
        timerIdRef.current = setInterval(updateTime,1000);


        return () => clearInterval(timerIdRef.current);
    },[session])

    const handleStartSession = () => {
        setLoading(true)
        fetch(baseUrl + `/sessions/${session._id}`,{
            method:'PATCH',
            headers:{
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.ok){
                return res.json()
            }
            return res.json().then(err => new Error(err.message))
        })
        .then((data) => {
            setLoading(false);
            console.log(JSON.stringify(data));
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    const handleExtendSession = () => {
        fetch(baseUrl + `/sessions/extend/${session._id}`,{
            method:"PATCH"
        })
        .then(res => {
            if(res.ok){
                return res.json()
            }
            return res.json().then(err => new Error(err.message))
        })
        .then(data => {
            if(loading)
                setLoading(false)
            console.log(data)
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    const handlePauseSession = () => {
        fetch(baseUrl + `/sessions/${session._id}/pause`,{
            method:'PATCH',
            headers:{
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.ok)
                return res.json();
            else{
                return res.json().then(err => new Error(err.message))
            }
        })
        .then(data => {
            // console.log(JSON.stringify(data))
        })
        .catch(err => {
            setErr(err.message)
        })
    }
    const handleResumeSession = () => {
        fetch(baseUrl + `/sessions/${session._id}/resume`,{
            method:'PATCH',
            headers:{
                "Content-Type": "application/json"
            }
        })                
        .then(res => {
            if(res.ok)
                return res.json();
            else{
                return res.json().then(err => new Error(err.message))
            }
        })
        .then(data => {
            console.log(JSON.stringify(data))
        })
        .catch(err => {
            setErr(err.message)
        })
    }

    const parseDate = (date) => {
        const seperatedDate = date.split('T')[1].split('.')[0].split(':').slice(0,2);

        let [hour, minute] = seperatedDate.map(Number);

        // Create a Date object with current GMT date
        let gmtDate = new Date();
        gmtDate.setUTCHours(hour);
        gmtDate.setUTCMinutes(minute);
    
        // Offset for Pacific Time (PT)
        let pacificOffset = -7 * 60 * 60 * 1000; // GMT-7
    
        // Calculate California time (GMT + Pacific offset)
        let californiaTime = new Date(gmtDate.getTime());
    
        // Format the time to hour:minute format
        let formattedTime = `${californiaTime.getHours()}:${californiaTime.getMinutes().toString().padStart(2, '0')}`;
    
        return formattedTime;
    }

    const formatTime = (seconds) => {
        return seconds > 60 ? `${Math.ceil(seconds/60)} minutes left` : `< than 1 minute left`;
    }

    return (
        <div key={idx} className="w-[13rem] h-[12rem] rounded-lg p-3 bg-black text-white flex flex-col justify-center items-center border border-mccd-gold-dark border-2">
            { 
                (loading && !session.startTime) &&
                <div className="w-[250px] h-[135px] flex justify-center items-center">
                    <div className="w-8 h-8 border-slate-300 border-t-white border-4 rounded-full animate-spin"/>
                </div>

            }

            {(!session.startTime && !loading) &&
                <div className="flex flex-col justify-center items-center gap-1">
                    <h2 className="underline tracking-wide text-sm">New Session</h2>
                    <div className="text-sm"> 
                        {session.student.length === 1 &&
                            <p>Participants: {session.tutorId.firstName} & {session.student[0].firstName}</p>
                        }
                        {session.student.length > 1 &&
                            <p>Group session: {session.tutorId.firstName} with 
                                {session.student.map((student,idx) => {
                                    return(
                                        ` ${(idx + 1 === session.student.length) ? `and ${student.firstName}` : `${student.firstName}, ` }`
                                    )
                                })}
                            </p>
                        }
                    </div>
                    <p className="text-sm">Subject: {session.subjectId.name}</p>
                    <div className="grid grid-row-2 m-2">
                        <button 
                            className="bg-mccd-blue px-2 my-1 mx-1 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light"
                            onClick={
                                () => {
                                    handleStartSession();
                                }}
                        >Start Session</button>
                        <button 
                            className="bg-mccd-blue px-2 my-1 mx-1 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light"                            
                            onClick={() => handleEndSession(session._id)}    
                        >Delete Session</button>
                    </div>
                </div>
            }
                     
            {(session.startTime && !loading) &&
                <div className="flex flex-col text-left text-sm">
                    <div>
                        {session.student.length === 1 &&
                            <p>Participants: {session.tutorId.firstName} & {session.student[0].firstName}</p>
                        }
                        {session.student.length > 1 &&
                            <p>Group session: {session.tutorId.firstName} with 
                                {session.student.map((student,idx) => {
                                    return(
                                        ` ${(idx + 1 === session.student.length) ? `and ${student.firstName}` : `${student.firstName}, ` }`
                                    )
                                })}
                            </p>
                        }
                    </div>
                    <p>Subject: {session.subjectId.name}</p>
                    
                    <p>Status: 
                        {!session.paused &&
                            <span className={(session.active === true && !session.extended) ? "font-bold text-green-600" : "font-bold text-orange-600"}>
                                {(session.active === true && !session.extended) ? " Active" : " Extended"}
                            </span>
                        }
                        {session.paused &&
                            <span className="font-bold text-yellow-400">
                               {" Paused"}
                            </span>
                        }
                    </p>

                    <p>Start Time: {parseDate(session.startTime)}</p> 
                    {!session.extended && !session.paused &&
                        <>
                            <p>Expected End: {parseDate(session.expectedEnd)} </p>   
                            {/* TO-DO: This should only appear when hovered on and should animate out. Keep the animation simple and subtle  */}
                            <p>Time Left: {formatTime(currTime)}</p>                
                        </>
                    }
                    {session.paused &&
                        <>
                            <p>Time Left: {formatTime(currTime)}</p>                
                        </>
                    }

                    <div className="flex flex-row">

                        <button 
                            className={` bg-mccd-blue px-1  my-1 mx-1 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light ${session.extended ? "hidden" : ""}`} 
                            onClick={() => handleExtendSession()}
                        >
                                Extend Session
                        </button>

                        <button 
                            className={`  bg-mccd-blue px-1  my-1 mx-1 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light ${session.extended ? "hidden" : ""}`} 
                            onClick={() => session.paused ? handleResumeSession() : handlePauseSession()}
                        >
                                {session.paused ? "Resume Session" : "Pause Session"}
                        </button>

                        <button 
                            className="bg-mccd-blue px-1 my-1 mx-1 border border-solid border-mccd-gold-dark border-2 rounded transition-all duration-300 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light"    
                            onClick={() => {
                                handleEndSession(session._id)
                            }}
                        >
                            End Session
                        </button>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default SessionCard;