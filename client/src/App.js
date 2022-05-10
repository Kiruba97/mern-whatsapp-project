import React from 'react'
import Login from './components/Login/Login'
import "./App.css"
import {useStateValue} from "./components/ContextApi/StateProvider"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Sidebar from "./components/Sidebar/Sidebar"
import Chat from "./components/Chat/Chat"

const App=() =>{
  const [{ user }]=useStateValue();
  
  return(
    <div className="app">
      {!user ? (
        <Login />
      ):(
        <div className="app__body">
           <Router>
             <Sidebar />
             <Routes>
               <Route path="/" element={<Chat />} />
               <Route path="/rooms/:roomId" element={<Chat />} />
             </Routes>
           </Router>
        </div>
      )}
    </div>
  );
};
export default App;



