import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import "./Edit_Serie_Style.css"
import env from "react-dotenv";

const StatusButton = (props)=> <button className={props.new_status === props.value ? "active" :""} onClick={()=>props.set_new_status(props.value)}>{props.value}</button>

const EditStatus = forwardRef((props,ref)=>{
    const { title, season } = props;
    const [old_status,set_old_status] = useState("");
    const [new_status,set_new_status] = useState("");
    const has_ran = useRef(false);
    const ongoing_status = "Ongoing";
    const finished_status = "Finished";

    const get_status = async ()=>{
        const { result:{status} } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({title,season,fields: ["status"]})
        }).then(resp=>resp.json());

        set_old_status(status);
        set_new_status(status);
    }


    const expose = ()=>{
        return {
            key: "status",
            old: old_status,
            new: new_status,
            refresh: get_status
        }
    }
    useImperativeHandle(ref,expose);

    useEffect(()=>{
        if(has_ran.current) return;
        has_ran.current = true;
        get_status();
    },[])
    
    return(
        <div className="field_container row_box status">
            <label>Status</label>
            <StatusButton value={ongoing_status} new_status={new_status} set_new_status={set_new_status} />
            <StatusButton value={finished_status} new_status={new_status} set_new_status={set_new_status} />
        </div>
    )
})

export default EditStatus;