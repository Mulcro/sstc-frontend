import './App.css';
import Session from './Components/Session/session';
import Admin from './Components/admin';
import SideBar from './Components/sidebar';
import React from 'react';

function App() {
  return (
    <div className="App">
      {/* <SideBar/>  */}
      {/* <Admin/> */}
      <Session/>
    </div>
  );
}

export default App;
