import { useEffect, useState } from "react";

const SessionCard = ({session,idx,handleEndSession}) => {
    const [currTime,setTimeLeft] = useState();

    useEffect(() => {

        const updateTime = () => {
            setTimeLeft(0);

            const endTime = new Date(session.expectedEnd);
            const timeLeft = Math.max(Math.floor((endTime - Date.now())/1000, 0));
            setTimeLeft(timeLeft);

            if(timeLeft === 0){
                fetch(`http://localhost:5000/sessions/end/${session._id}`,{
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

    //TO-DO
    const parseDate = (date) => {
        console.log(date);
    }

    const formatTime = (seconds) => {
        return seconds > 60 ? `${Math.ceil(seconds/60)} minutes left` : `< than 1 minute left`;
    }

    return ( 
        <div id={idx} className="p-3 bg-black text-white font bold flex flex-col">
            {session.tutorId.firstName} with {session.student.firstName}

            <p>Status: <span className={session.active === true ? "font-bold text-green-600" : "font-bold text-red-600"}>{session.active === true ? "Active" : "Inactive"}</span>       </p>
            <p>Start Time: {session.startTime}     </p> 
            <p>Expected End: {session.expectedEnd} </p>   

            {/* TO-DO: This should only appear when hovered on and should animate out. Keep the animation simple and subtle  */}
            <p>Time Left: {formatTime(currTime)}</p>

            <div>
                <button onClick={() => handleEndSession(session._id)}>End Session</button>
            </div>
            

        </div>
     );
}
 
export default SessionCard;