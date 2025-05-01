import React, { useState,useLayoutEffect, useCallback, useEffect, useRef } from "react"
import { BrowserRouter as Router , Routes , Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ModalHandler from "./Modal/Modal_Handler";
import Home from "./Home/Home";
import Manage from "./Manage/Manage";
import Upload from "./Upload/Upload";
import Genre from "./Genre/Genre"
import EditSerie from "./EditSerie/Edit_Serie";

const RoutedApp = ()=>{
  const [viewport,set_viewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [modal,set_modal] = useState(null);
  const location = useLocation();
  const previous_location = useRef(location.pathname);

  const obj = {viewport,set_modal};

  const handle_resize = useCallback(()=>set_viewport({ width: window.innerWidth, height: window.innerHeight }),[]);
  
  useLayoutEffect(()=>{
    window.addEventListener("resize",handle_resize);
    handle_resize();
    return ()=>window.removeEventListener("resize",()=>{});
  },[handle_resize])

  useEffect(()=>{
      if(previous_location.current !== location.pathname) set_modal(null);
      previous_location.current = location.pathname;
  },[location]);

  return(
    <div style={{position: "relative"}}>
    <ModalHandler modal={modal} viewport={viewport}/>
    <ToastContainer />
    <Routes>
    <Route path="/" element={<Navigate to="/home" replace/>}/>
    <Route path="/home" element={<Home {...obj}/>}/>
    <Route path="/manage" element={<Manage {...obj}/>}/>
    <Route path="/upload" element={<Upload {...obj}/>}/>
    <Route path="/genre" element={<Genre {...obj}/>}/>
    <Route path="/edit" element={<EditSerie {...obj}/>}/>
    </Routes>
    </div>
  ) 
}

const App = ()=>{
  return <Router><RoutedApp/></Router>
}

export default App;
