import ClearTrash from "./ClearTrashCard";
import Header from "../Header/Header";
import React from "react"

import "./Home_Style.css";
import MissingThumbnail from "./MissingThumbnail";
import MissingInfo from "./MissingInfo";
import SeriesCount from "./SeriesCount";
import ServerHealth from "./ServerHealth";

const Home = (props)=>{
    return <>
    <Header {...props}/>
    <div className="home">
        <div className="row_box">
            <div className="left"></div>
            <div className="mid column_box">
                <div className="row_box">
                    <ClearTrash {...props}/>
                    <div className="column_box">
                        <div className="row_box">
                            <MissingThumbnail {...props}/>
                            <MissingInfo {...props}/>
                        </div>
                        <SeriesCount {...props}/>
                    </div>
                </div>
                <ServerHealth {...props}/>
            </div>
            <div className="right"></div>
        </div>
    </div>
    </>
}

export default Home;