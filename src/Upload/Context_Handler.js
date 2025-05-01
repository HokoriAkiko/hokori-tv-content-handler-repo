import React, { forwardRef, useImperativeHandle, useState } from "react"
import "./Upload_Style.css"

const ContextHandler = forwardRef((props,ref)=>{
    const [context,set_context] = useState("");
    const on_reset = ()=> set_context("");
    const expose = ()=>{
        return {
            key: "context",
            value : context,
            on_reset
        }
    }

    useImperativeHandle(ref,expose);

    return(
        <div className="field_container context row_box">
            <label>Context</label>
            <input value={context} type="text" onChange={(e)=>set_context(e.target.value)} placeholder="Enter Context" />
        </div>
    ) 
})

export default ContextHandler;