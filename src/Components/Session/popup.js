//data-type prop; 0 for create, 1 for queue
const Popup = ({handleFunction, data,setTutorId,setStudentFirstName,setStudentLastName,setStudentId,setSessionType,setPopup,dataType,err}) => {

    return (
        <div className="absolute top-0 bg-black bg-opacity-50 w-full h-full">
            <div className='relative m-auto top-1/4 w-1/2 bg-white p-5 border-solid border-2 border-black flex flex-col justify-center items-center gap-1'>
                <button onClick={() => setPopup(false)}>Close</button>

                <div className={err ? "block bg-black border-2 border-solid border-orange-400 text-orange-400 font bold rounded-xl p-2" : "hidden"}>{err}</div>

                { dataType === 0 ? <h2>Available Tutors</h2> : <h2>Clocked In Tutors</h2>}
                <form className='flex flex-col' onSubmit={e => handleFunction(e)}>
                    <select onChange={e => setTutorId(e.target.value)}  >
                        <option>-- Select Tutor --</option>
                        {
                        data.tutors.map((tutor,id) => {
                            return (
                                    <option key={id} value={tutor._id}>{tutor.firstName} {tutor.lastName}</option>
                            )
                        })
                    }</select>

                    <label htmlFor="">Student First Name</label>
                    <input type='text' onChange={e => setStudentFirstName(e.target.value)}/>

                    <label htmlFor="">Student Last Name</label>
                    <input type='text' onChange={e => setStudentLastName(e.target.value)}/>

                    <label htmlFor="">Student Id</label>
                    <input type="number" onChange={(e) => setStudentId(e.target.value)}/>

                    <label htmlFor="">Session Type</label>
                    <select onChange={e => setSessionType(e.target.value)} name="" id="">
                        <option value={null}>-- Select Type --</option>
                        <option value={0}>Regular</option>
                        <option value={2}>EOPS</option>
                    </select>


                    <button formAction='submit' >{dataType === 0 ? "Create Session" : "Queue Session"}</button>
                </form>
            </div>
        </div>
    )
}

export default Popup;