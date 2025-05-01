import React, { forwardRef, useImperativeHandle, useState } from "react"
import "./Upload_Style.css"

const TitleHandler = forwardRef((props,ref)=>{
    const [title,set_title] = useState("");
    const on_reset = ()=> set_title("");
    const expose = ()=>{
        return {
            key:"title",
            value: title,
            on_reset
        }
    }

    useImperativeHandle(ref,expose);

    return(
        <div className="field_container row_box title">
            <label>Title</label>
            <input className="title_input" type="text" onChange={(e)=> set_title(e.target.value)} value={title} placeholder="Enter Title"/>
        </div>
    )
})

export default TitleHandler;