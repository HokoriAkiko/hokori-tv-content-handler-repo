import React, { forwardRef, useImperativeHandle, useState } from "react";

import "./Edit_Serie_Style.css";

const EditTitle = forwardRef((props,ref)=>{
    const {title} = props;
    const[new_title,set_new_title] = useState(title);

    const expose = ()=>{
        return {
            key: "title",
            old: title,
            new: new_title,
            refresh: ()=>set_new_title(title)
        }
    }
    useImperativeHandle(ref,expose);

    return(
        <div className="field_container row_box title">
            <label>Title</label>
            <input type="text" onChange={(e)=> set_new_title(e.target.value)} value={new_title} placeholder="Enter Title"/>
        </div>
    )
})

export default EditTitle;