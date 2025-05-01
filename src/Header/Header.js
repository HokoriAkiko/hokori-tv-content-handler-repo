import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";

import "./Header_Style.css";

const HeaderNav = (props)=>{
    const {navigate,location,path,name} = props;
    return(
        <button className={`${location.pathname === path ? "active" : ""} `}
        onClick={()=>navigate(path)}>
            {name}
        </button>
    )

}

const Header = ()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const [show_menu,set_show_menu]= useState(false);
    const toggle_menu = ()=>set_show_menu(show => !show);

    const navs = [
        { name: "Home", path: "/home" },
        { name: "Manage", path: "/manage"},
        { name: "Upload", path: "/upload"},
        { name: "Genres", path: "/genre"}
    ]

    const render_left = ()=> <div className="left row_box"></div>

    const render_mid = ()=>{
        return(
            <div className="mid row_box">
                <img className="brand" src="brandname.png" alt="brandname"/>
                {navs.map((v,i)=><HeaderNav navigate={navigate} location={location} {...v} key={`${v.name}-${i}`}/>)}
            </div>
        )
    }

    const render_right = ()=>{
        return(
            <div className="right row_reverse_box"> 
                <div className="menu" onClick={toggle_menu}></div> 
                Content Handler 
            </div>
        )
    }

    const render_expand = ()=>{
        if(show_menu){
            return(
                <div className="expand column_box">{navs.map((v,i)=><HeaderNav navigate={navigate} location={location} {...v} key={`${v.name}-${i}`}/>)}</div>
            )
        }
        return null;
    }

    return(
        <div className="header">
            <div className="row_box"> {render_left()} {render_mid()} {render_right()} </div>
            {render_expand()}
        </div>
    )
}

export default Header;