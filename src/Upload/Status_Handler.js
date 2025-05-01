import React, { forwardRef, useImperativeHandle, useState } from "react"

import "./Upload_Style.css"

const StatusButton = (props)=>{
    const {value,set_status,status} = props;
    const active = value === status;
    const handle_click = ()=> { if(!active) set_status(value) }

    return <button className={`${active ? "active": ""}`} onClick={handle_click}> {value} </button>
}

const StatusHandler = forwardRef((props,ref)=>{
    const ongoing_status = "Ongoing";
    const finished_status = "Finished";
    const [status,set_status] = useState(finished_status);
    const pass = {status,set_status,...props};
    const on_reset = ()=> set_status(finished_status);

    const expose = ()=>{
        return {
            key : "status",
            value: status,
            on_reset
        }
    }
    useImperativeHandle(ref,expose);

    return (
        <div className="field_container status row_box">
            <label>Status</label>
            <StatusButton value={ongoing_status} {...pass}/>
            <StatusButton value={finished_status} {...pass}/>
        </div>
    )
})

export default StatusHandler;