import './App.css';
import Session from './Components/Session/session';
import Admin from './Components/admin';
import SideBar from './Components/sidebar';
import React from 'react';
import {useDispatch} from "react-redux";
import { fetchActiveSessions} from './State/Session/sessionSlice';
import { useEffect } from 'react';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshActiveSessions = () => {
      dispatch(fetchActiveSessions())
    }

    refreshActiveSessions();  

    const timerId = setInterval(refreshActiveSessions,2500)

    return () => clearInterval(timerId)
  },[])


  return (
    <div className="App">
      {/* <SideBar/>  */}
      {/* <Admin/> */}
      <Session/>
    </div>
  );
}

export default App;
