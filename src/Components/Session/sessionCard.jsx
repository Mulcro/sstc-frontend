import { useEffect, useState } from "react";
import baseUrl from '../../baseUrl';


const SessionCard = ({session,idx,handleEndSession}) => {
    const [currTime,setTimeLeft] = useState();

    useEffect(() => {

        const updateTime = () => {
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

        const timerId = setInterval(updateTime,1000);


        return () => clearInterval(timerId);
    },[session])

    const handleExtendSession = () => {
        fetch(baseURL + `/sessions/extend/${session._id}`,{
            method:"PATCH"
        })
        .then(res => {
            if(res.ok){
                return res.json()
            }
            return res.json().then(err => new Error(err.message))
        })
        .then(data => {
            console.log(data)
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    //TO-DO
    const parseDate = (date) => {
        console.log(date);
    }

    const formatTime = (seconds) => {
        return seconds > 60 ? `${Math.ceil(seconds/60)} minutes left` : `< than 1 minute left`;
    }

    return ( 
        <div className="p-3 bg-black text-white font bold flex flex-col justify-center items-center">
            {session.tutorId.firstName} with {session.student.firstName}

            <p>Status: <span className={session.active === true ? "font-bold text-green-600" : "font-bold text-red-600"}>{session.active === true ? "Active" : "Inactive"}</span>       </p>
            <p>Start Time: {session.startTime}     </p> 
            <p>Expected End: {session.expectedEnd} </p>   

            {/* TO-DO: This should only appear when hovered on and should animate out. Keep the animation simple and subtle  */}
            <p>Time Left: {formatTime(currTime)}</p>

            <div className="flex flex-row gap-2">
                <button onClick={() => handleExtendSession}>Extend Session</button>
                <button onClick={() => handleEndSession(session._id)}>End Session</button>
            </div>
            

        </div>
     );
}
 
export default SessionCard;