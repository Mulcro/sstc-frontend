import './App.css';
import Session from './Components/Session/session';
import Admin from './Components/Admin/admin';
import Navbar from './Components/navbar';
import Main from './Components/main';
import NotFound from './Components/notFound'
import React from 'react';
import {useDispatch} from "react-redux";
import { fetchActiveSessions} from './State/Session/sessionSlice';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
    <BrowserRouter>
      <div className="bg-gradient-to-r from-mccd-blue from-20% to-mccd-gold font-proxima-nova">
        <Navbar/>
        {/* <SideBar/>  */}
        <Routes>
          <Route path='/' element={<Main/>} />
          <Route path='/admin' element={<Admin/>}/>
          <Route path='sessions' element={<Session/>}/>

          {/* 404 Page */}
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
