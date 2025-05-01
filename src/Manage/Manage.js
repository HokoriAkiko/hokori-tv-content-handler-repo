import React from "react"
import Header from "../Header/Header";
import ManageFilter from "./ManageFilter.js";
import SerieList from "./SerieList.js";

import "./Manage_Style.css";

const Manage = (props)=>{
    return <>
    <Header {...props}/>
    <div className="manage">
        <div className="row_box">
            <div className="left"></div>
            <div className="mid column_box">
                <ManageFilter {...props}/>
                <SerieList {...props}/>
            </div>
            <div className="right"></div>
        </div>
    </div>
    </>
}

export default Manage;