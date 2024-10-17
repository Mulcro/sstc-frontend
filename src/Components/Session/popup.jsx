import { motion, spring } from "framer-motion";
import { useEffect, useState } from "react";


const stringRegex = /^[a-zA-Z]{2,}$/;
const idRegex = /^\d{7}$/;


const StudentPopup = ({firstName, lastName, setStudentFirstName,setStudentLastName,setStudentPopup,setStudents}) => {

    const [studentId, setStudentId] = useState();

    const [validFName,setValidFName] = useState(false)
    const [validLName,setValidLName] = useState(false)
    const [validId,setValidId] = useState(false)

    useEffect(() => {
        setValidFName(stringRegex.test(firstName));
        setValidLName(stringRegex.test(lastName));
        setValidId(idRegex.test(studentId));

    },[firstName,lastName,studentId])

    return(
        <div className="absolute left-0 top-0 bg-black bg-opacity-50 w-full h-full">
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity:1,scale:1}}
                transition={{
                    duration: 0.2,
                    ease: "linear"
                }}
                className='relative m-auto top-5 w-full bg-white p-5 border-solid border-2 border-black flex flex-col justify-center items-center gap-1'
            >
                <button className="bg-red-600 font-bold w-[4rem] border-solid border-black border-2 rounded hover:bg-red-700" onClick={() => setStudentPopup(false)}>Close</button>
                
                <label className="font-bold underline" htmlFor="">Student First Name</label>
                <input className="border-solid border-2 border-black rounded" type='text' onChange={e => setStudentFirstName(e.target.value)}/>

                <label className="font-bold underline" htmlFor="">Student Last Name</label>
                <input className="border-solid border-2 border-black rounded" type='text' onChange={e => setStudentLastName(e.target.value)}/>

                <label className="font-bold underline" htmlFor="">Student Id</label>
                <input className="border-solid border-2 border-black rounded" type="number" onChange={(e) => setStudentId(e.target.value)}/>
                <button type="button" className="mt-5 bg-green-300 w-20 border-solid border-2 border-black font-bold m-auto hover:bg-green-400 rounded disabled:bg-green-300/20 disabled:border-none disabled:text-slate-300"
                    disabled={(validFName && validLName && validId) === false ? true : false }
                    onClick={() => {
                        setStudents(prevStudents => {
                            const newStudents = new Map(prevStudents);
                            newStudents.set(studentId,{firstName,lastName,studentId})
                            return newStudents;
                        })
                        setStudentPopup(false)
                    }}
                >Add
                </button>
            </motion.div>
        </div>
    )
}

const Popup = ({students,setStudents,handleFunction, data,tutorId, setTutorId,setStudentFirstName,setStudentLastName, setSessionLanguage,setSessionType,languageData,setPopup,dataType,firstName,lastName, type, language}) => {
    const [err,setErr] = useState();

    // useEffect(() => {
    //   console.log("Language Data: " + JSON.stringify(languageData))  
    // },[])

    const [displayStudentPopup,setStudentPopup] = useState(false);

    const [validStudents, setValidStudents] = useState(false);
    const [validType, setValidType] = useState(false)
    const [validLanguage, setValidLanguage] = useState(false)

    useEffect(() => {
        if(type !== ""){
            setValidType(true)
        }
        else{
            setValidType(false)
        }

        if(language !== ""){
            setValidLanguage(true)
        }
        else{
            setValidLanguage(false)
        }
        
        if(students.size > 0){
            setValidStudents(true)
        }
        else{
            setValidStudents(false)
        }

    },[tutorId,students,type, language])

    return (
        <div 
            className="absolute top-0 bg-black bg-opacity-50 w-full h-full"
        >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity:1,scale:1}}
                    transition={{
                        duration: 0.2,
                        ease: "linear"
                    }}
                    className='relative m-auto top-1/4 w-1/3 bg-white p-5 border-solid border-2 border-black flex flex-col justify-center items-center gap-1'>
                    <button className="absolute right-0 top-0 me-5 mt-5 bg-red-600 font-bold w-[1.5rem] border-solid border-black border-2 rounded hover:bg-red-700" 
                        onClick={() => {
                            setStudents(new Map())
                            setPopup(false)
                        }}>
                            X
                        </button>

                    <div className={err ? "block bg-black border-2 border-solid border-orange-400 text-orange-400 font bold rounded-xl p-2" : "hidden"}>{err}</div>

                    { dataType === 0 ? <h2 className="font-bold underline">Available Tutors</h2> : <h2 className="font-bold underline">Clocked In Tutors</h2>}
                    <form className='flex flex-col gap-2' 
                        onSubmit={e => {
                            console.log("hit")
                            handleFunction(e)
                            setStudents(new Map())
                            setPopup(false)
                        }
                    }
                    >
                        <select className="border-solid border-2 border-black rounded" onChange={e => setTutorId(e.target.value)}  >
                            <option>-- Select Tutor --</option>
                            {
                            data.tutors.map((tutor,id) => {
                                return (
                                        <option key={id} value={tutor._id}>{tutor.firstName} {tutor.lastName}</option>
                                )
                            })
                        }</select>

                        {students.size === 0 &&
                            <></>
                        }
                        {students.size !== 0 &&
                            <div>
                                <label className="font-bold underline">Students</label>
                                {Array.from(students.entries()).map(([key,student],idx) => {
                                        return (
                                            <div key={idx} className="flex flex-row justify-between pt-1">
                                                <div className="pt-1">
                                                    <p className="font-bold">{student.firstName} {student.lastName}</p>
                                                </div>

                                                <button type="button" className="font-bold text-small w-[1rem] border-solid border-black border-2 rounded bg-red-500 hover:bg-red-600" value={key} onClick={e => setStudents(
                                                    prevStudents => {
                                                        const newStudents = new Map(prevStudents);
                                                        newStudents.delete(e.target.value);
                                                        return newStudents;
                                                    }
                                                )}>x</button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        {displayStudentPopup &&
                            <StudentPopup firstName={firstName} lastName={lastName} setStudentFirstName={setStudentFirstName} setStudentLastName={setStudentLastName} setStudentPopup={setStudentPopup} setStudents={setStudents} students={students}/>
                        }

                        <button
                            type="button"
                            className="mt-2 bg-green-300 w-[15rem] border-solid border-2 border-black font-bold m-auto rounded hover:bg-green-400"
                            onClick={() => setStudentPopup(true)}
                        >
                            Add Student to Session
                        </button>

                        <label className="font-bold underline" htmlFor="">Session Type</label>
                        <select 
                            onChange={e => setSessionType(e.target.value)}
                            className="border-solid border-2 border-black rounded"    
                        >
                            <option value={""}>-- Select Type --</option>
                            <option value={0}>Regular</option>
                            <option value={2}>DSPS</option>
                        </select>

                        <div className="m-5 flex flex-col">
                            <label className="font-bold underline" htmlFor="">Session Language</label>
                            <select
                                className="border-solid border-2 border-black rounded"
                                onChange={(e) => { 
                                    setSessionLanguage(e.target.value)
                                }} 
                            >
                                <option value={""}>--Select Session Language--</option>
                                {languageData.map((language,idx) => {
                                    return(
                                        <option key={idx} value={language._id}>
                                            {language.name}
                                        </option>                                        
                                    )
                                })}
                            </select>
                        </div>

                        {/* Button doesn't disable correctly */}
                        <button 
                            disabled={(validLanguage && validStudents && validType) === false ? true : false}
                            type="submit"
                            className="m-auto border border-mccd-gold broder-2 bg-mccd-blue w-[10rem] rounded border-black border-solid border-2 font-bold text-white transition-all duration-500 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light disabled:bg-blue-800/20 disabled:border-mccd-gold-dark disabled:text-white" >
                                {dataType === 0 ? "Create Session" : "Queue Session"}
                        </button>
                    </form>
                </motion.div>
        </div>
    )
}



export default Popup;