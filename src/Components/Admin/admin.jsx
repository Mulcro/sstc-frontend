import {useState,useEffect} from 'react';
import useFetch from '../../hooks/useFetch';
import baseUrl from '../../baseUrl';
import CreateGroupTable from './createGroupSession';

const Admin = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentId, setStudentId] = useState();
    const [mondayHours,setMondayHours] = useState([])
    const [tuesdayHours,setTuesdayHours] = useState([])
    const [wednesdayHours,setWednesdayHours] = useState([])
    const [thursdayHours,setThursdayHours] = useState([])
    const [fridayHours,setFridayHours] = useState([])
    const [tutorSubjects,setTutorSubjects] = useState([])

    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

    const hours = [
        { startTime: 9, endTime: 10 },
        { startTime: 10, endTime: 11 },
        { startTime: 11, endTime: 12 },
        { startTime: 12, endTime: 13 },
        { startTime: 13, endTime: 14 },
        { startTime: 14, endTime: 15 },
        { startTime: 15, endTime: 16 },
        { startTime: 16, endTime: 17 },
        { startTime: 17, endTime: 18 }
    ]
    
    const [allSubjects, subjectsLoading, subjectsError] = useFetch(baseUrl + '/subjects');


    //Logic to add hours
    //TODO: These can currently be added randomly and not in order. I haven't figured out a way for the active status to be depicted so note this
    const handleHoursCheckbox = (e,data,indx,day) =>{
        switch(day){
            case "Monday":
                if(e.target.checked){
                    setMondayHours([...mondayHours, data])
                } else {
                    setMondayHours(mondayHours.filter(
                        hour => {
                            return hour.startTime !== hours[indx].startTime
                        }
                    ))
                }
            case "Tuesday":
                if(e.target.checked){
                    setTuesdayHours([...tuesdayHours, data])
                } else {
                    setTuesdayHours(tuesdayHours.filter(
                        hour => {
                            return hour.startTime !== hours[indx].startTime
                        }
                    ))
                }
            case "Wednesday":
                if(e.target.checked){
                    setWednesdayHours([...wednesdayHours, data])
                } else {
                    setWednesdayHours(wednesdayHours.filter(
                        hour => {
                            return hour.startTime !== hours[indx].startTime
                        }
                    ))
                }
            case "Thursday":
                if(e.target.checked){
                    setThursdayHours([...thursdayHours, data])
                } else {
                    setThursdayHours(thursdayHours.filter(
                        hour => {
                            return hour.startTime !== hours[indx].startTime
                        }
                    ))
                }
            case "Friday":
                if(e.target.checked){
                    setFridayHours([...fridayHours, data])
                } else {
                    setFridayHours(fridayHours.filter(
                        hour => {
                            return hour.startTime !== hours[indx].startTime
                        }
                    ))
                }
            
        }
    }

    const handleSubjectsCheckBox = (e) => {
        console.log(typeof mondayHours);
        console.log(e.target);
        if(e.target.checked){
            setTutorSubjects([...tutorSubjects, allSubjects.subjects[e.target.value]._id])
        }
        else {
            console.log(typeof tutorSubjects)
            setTutorSubjects(tutorSubjects.filter(
                subject => {
                    return subject !== allSubjects.subjects[parseInt(e.target.value)]._id;
                }
            ))
        }
    }

    const handleCreateTutor = (e) => {
        e.preventDefault();
        console.log(               {firstName,
            lastName,
            studentId:parseInt(studentId),
            subjects:tutorSubjects,
            shifts: {
                monday:mondayHours,
                tuesday:tuesdayHours,
                wednesday:wednesdayHours,
                thursday:thursdayHours,
                friday:fridayHours,
            }})
        fetch(baseUrl + "/tutors",  {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                firstName,
                lastName,
                studentId:parseInt(studentId),
                subjects:tutorSubjects,
                shifts: {
                    monday:mondayHours,
                    tuesday:tuesdayHours,
                    wednesday:wednesdayHours,
                    thursday:thursdayHours,
                    friday:fridayHours,
                }
            })
        })
        .then(
            res => {
                setFirstName('')
                setLastName('')
                setStudentId()
                setTutorSubjects([])
                setMondayHours([])
                setTuesdayHours([])
                setWednesdayHours([])
                setThursdayHours([])
                setFridayHours([])
                return res.json()
            }
        )
        .then(
            data => {
                alert(data.message)
            }
        )
        .catch(
            err => {
                console.log(err)
            }
        )
    }

    useEffect(() => {
        console.log(tutorSubjects)
    }, [tutorSubjects])

    return ( 
        <>
        <CreateGroupTable/>
        <>
        Working
            { (subjectsLoading) &&
            
                <div>Loading...</div> 

            }
            { (subjectsError) &&
                
                    <div>Error...</div>
            }
            { (allSubjects) &&
                    <div>
                        <form className="flex flex-col justify-center items-center p-5 bg-slate-500 border-black border-2 border-solid rounded-xl shadow-lg gap-3"
                            onSubmit={e => handleCreateTutor(e)}
                        >
                            <label htmlFor="">First name: </label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                            <label htmlFor="">Last name: </label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/>

                            <label htmlFor="">Student ID: </label>
                            <input type="number" value={studentId} onChange={(e) => setStudentId(e.target.value)}/>

                            <label htmlFor="">Subject: </label>
                                <div className="flex flex-row flex-wrap">
                                {allSubjects.subjects.map((subject, indx) => {
                                    return (
                                    <div id={indx} className="flex flex-col gap-5 p-1 m-3">
                                        <label>{subject.name}</label>
                                        <input type="checkbox" value={indx} onChange={e => handleSubjectsCheckBox(e)} />
                                    </div>
                                    )
                                })}
                                </div>
                            
                            <label htmlFor="">Shift Selection: </label> 
                            <div className="flex flex-row gap-3 flex-wrap justify-center items-center bg-slate-300 p-2">
                            {days.map((day,indx) => { return (
                                <div>
                                    <div id={indx} className="flex flex-col bg-slate-500 p-2 rounded-xl border-solid border-1 border-black">
                                        <label htmlFor="">{day}</label>    
                                        <div className="grid grid-cols-3 justify-center items-center">

                                        {hours.map((hour,indx) =>{
                                            return(
                                            <div className="flex flex-col gap-1 p-1">
                                                <label htmlFor="">{hour.startTime}:00 - {hour.endTime}:00</label>    
                                                <input type="checkbox" onChange={e=> {
                                                    handleHoursCheckbox(e,hour,indx,day)
                                                }} />
                                            </div>
                                        )})}
                                        </div>
                                    </div>
                                </div>
                            )})}
                            </div>

                            <button formAction='submit'className='py-2 px-5 rounded-xl bg-blue-200 font-bold border-solid border-black border-1 hover:bg-blue-300'>Create</button>
                        </form>
                    </div>
            }
        </>
        </>
     )
}
 
export default Admin;