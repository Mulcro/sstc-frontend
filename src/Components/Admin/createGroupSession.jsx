import baseUrl from "../../baseUrl";
import useFetch from "../../hooks/useFetch";
import {useEffect, useState} from 'react'

const CreateGroupTable = () => {
    const [name,setName] = useState('');
    const [groupSubjects,setGroupSubjects] = useState([]);

    const [subjects,subjectsLoading,subjectsError] = useFetch(baseUrl + "/subjects");

    const handleSubjectsCheckBox = (e) => {
        if(e.target.checked){
            setGroupSubjects([...groupSubjects, subjects.subjects[e.target.value]._id])
        }
        else {
            setGroupSubjects(groupSubjects.filter(
                subject => {
                    return subject !== subjects.subjects[parseInt(e.target.value)]._id;
                }
            ))
        }
    }

    useEffect(() => {
        console.log("Group Subjects: " + groupSubjects)
    },[groupSubjects])

    const handleCreateGroupSession = e => {
        e.preventDefault();

        fetch(baseUrl + '/grouptables',{
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                subjects:groupSubjects
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
            alert(data);
        })
        .catch(
            err => {
                setErr(err.message)
            }
        )
    }

    return ( 
        <div>
            {subjects &&
                <div className="flex flex-col justify-center items-centers">
                    <label>Create Group Table</label>
                    <form  className="flex flex-col justify-center items-center p-10 bg-black/50" onSubmit={e => handleCreateGroupSession(e)}>
                        <label>Group Table Name</label>
                        <input type="text" onChange={(e => setName(e.target.value))}/>

                        <label htmlFor="">Subject: </label>
                        <div className="flex flex-row flex-wrap">
                        {subjects.subjects.map((subject, indx) => {
                            return (
                            <div id={indx} className="flex flex-col gap-5 p-1 m-3">
                                <label>{subject.name}</label>
                                <input type="checkbox" value={indx} onChange={e => handleSubjectsCheckBox(e)} />
                            </div>
                            )
                        })}
                        </div>

                        <button type="submit">Create Group Table</button>
                    </form>
                </div>
            }
        </div>
     );
}
 
export default CreateGroupTable;