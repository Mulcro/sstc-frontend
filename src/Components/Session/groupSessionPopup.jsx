import { motion, spring } from "framer-motion";
import { useEffect, useState } from "react";
import baseUrl from "../../baseUrl";


const stringRegex = /^[a-zA-Z]{2,}$/;
const idRegex = /^\d{7}$/;


const GroupPopup = ({subjectRef, sessionTypeRef, close,resetType,table,languageData,subject}) => {
    const [firstName,setFirstName] = useState()
    const [lastName,setLastName] = useState()
    const [studentId,setStudentId] = useState()
    const [sessionLangauage,setSessionLanguage] = useState();
    const [type,setType] = useState();

    const [validFName,setValidFName] = useState(false)
    const [validLName,setValidLName] = useState(false)
    const [validId,setValidId] = useState(false)
    const [validType, setValidType] = useState(false)
    const [validLanguage,setValidLanguage] = useState(false)

    const [err,setErr] = useState()

    const handleCreateGroupSession = (e) => {
        e.preventDefault();
        console.log("Langauage: " + sessionLangauage)

        fetch(baseUrl + '/sessions/group',{
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                studentId,
                subjectId:subject,
                groupTableId: table._id,
                type,
                language: sessionLangauage
            })
        })
        .then(res => {
            if(res.ok)
                return res.json()
            else{
                throw new Error(res.status)
            }
        })
        .then(data => {
            // subjectRef.current.value = "";
            // sessionTypeRef.current.value = "";
            setErr()
            resetType()
            close()
        })
        .catch(err => {
            if(err.message === "409"){
                setErr("This student is already in an active session")
            }
        })
    }

    useEffect(() => {
        setValidFName(stringRegex.test(firstName));
        setValidLName(stringRegex.test(lastName));
        setValidId(idRegex.test(studentId));

    },[firstName,lastName,studentId])

    useEffect(() => {
        if(type !== ""){
            setValidType(true)
        }
        else{
            setValidType(false)
        }

        if(sessionLangauage !== ""){
            setValidLanguage(true)
        }
        else{
            setValidLanguage(false)
        }

    },[type, sessionLangauage])

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
                    className='relative m-auto top-[10%] w-1/3 bg-white p-5 border-solid border-2 border-black flex flex-col justify-center items-center gap-1 rounded-lg'>
                    
                    <button 
                        className="absolute right-0 top-0 me-5 mt-5 bg-red-600 font-bold w-[1.5rem] border-solid border-black border-2 rounded hover:bg-red-700"
                         
                        onClick={() => {
                            close()
                        }
                    }>
                            X
                    </button>

                    <div className={err ? "block bg-black border-2 border-solid border-orange-400 text-orange-400 font bold rounded-xl p-2" : "hidden"}>{err}</div>

                    <h2 className="font-bold underline">Confirm Group Session</h2>
                    <form className='flex flex-col gap-2' 
                        onSubmit={e => {
                            handleCreateGroupSession(e)

                        }
                    }
                    >
                        <label className="font-bold underline">Group Table</label>
                        <select className="border-solid border-2 border-black rounded">
                            <option value={table._id}>{table.name}</option>
                        </select>
                        <label className="font-bold underline" htmlFor="">Student First Name</label>
                        <input className="border-solid border-2 border-black rounded" type='text' onChange={e => setFirstName(e.target.value)}/>
    
                        <label className="font-bold underline" htmlFor="">Student Last Name</label>
                        <input className="border-solid border-2 border-black rounded" type='text' onChange={e => setLastName(e.target.value)}/>
    
                        <label className="font-bold underline" htmlFor="">Student Id</label>
                        <input className="border-solid border-2 border-black rounded" type="number" onChange={(e) => setStudentId(e.target.value)}/>
                        
                        <label className="font-bold underline">Session Language</label>
                        <div className="flex flex-col">
                            <select
                                className="w-full border-solid border-2 border-black rounded"
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

                        <label className="font-bold underline" htmlFor="">Session Type</label>
                        <select 
                            onChange={e => setType(e.target.value)}
                            className="border-solid border-2 border-black rounded"    
                        >
                            <option value={""}>-- Select Type --</option>
                            <option value={0}>Regular</option>
                            <option value={2}>DSPS</option>
                        </select>

                        {/* Button doesn't disable correctly */}
                        <button 
                            disabled={(validType && validLanguage && validFName && validLName && validId) === false ? true : false}
                            type="submit"
                            className="mt-3 m-auto border border-mccd-gold broder-2 bg-mccd-blue w-[12rem] rounded border-black border-solid border-2 font-bold text-white transition-all duration-500 ease-in-out hover:bg-mccd-gold-dark hover:text-mccd-blue hover:border-mccd-blue-light disabled:bg-blue-800/20 disabled:border-mccd-gold-dark disabled:text-white" >
                                Create Group Session
                        </button> 
                    </form>
                </motion.div>
        </div>
    )
}



export default GroupPopup;