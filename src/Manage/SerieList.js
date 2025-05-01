import React, { useEffect, useState } from "react"
import event_handler from "../EventEmitter";
import { toast } from "react-toastify";
import SerieCard from "./SerieCard";
import env from "react-dotenv"

import "./Manage_Style.css";

const SerieList = (props)=>{
    const [series,set_series] = useState([]);
   
    const apply_filter = async (filter)=>{
        try{
            const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_series`,{
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body : JSON.stringify(filter),
            }).then(data=>data.json());

            set_series(result);
        }
        catch(e) { toast("Error occured while fetching results",{type : "error"}); }
    }
    
    useEffect(()=>{
        event_handler.push("af",apply_filter);//registering the apply_filter event
        apply_filter();
        return ()=> event_handler.pop("af",apply_filter); //cleanup
    },[])

    return(
        <div className="grid_box cards">
            {series.map((value,index)=><SerieCard key={`${value.title} - ${value.season} - ${index}`} {...value} {...props} />)}
        </div>
    )
}

export default SerieList;