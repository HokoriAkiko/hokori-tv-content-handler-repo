import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import "./Edit_Serie_Style.css";
import env from "react-dotenv";

const EditContext = forwardRef((props,ref)=>{
    const { title, season } = props;
    const [old_context,set_old_context] = useState("");
    const[new_context,set_new_context] = useState("");
    const has_ran = useRef(false);

    const get_context = async ()=>{
        const { result: {context} } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({title,season,fields: ["context"]})
        }).then(resp=>resp.json());

        set_old_context(context);
        set_new_context(context);
    }

    useEffect(()=>{
        if(has_ran.current) return ;
        has_ran.current = true;
        get_context();
    },[])

    const expose = ()=>{
        return {
            key: "context",
            old: old_context,
            new: new_context,
            refresh: get_context,
        }
    }
    useImperativeHandle(ref,expose);
    return(
        <div className="field_container row_box context">
            <label>Context</label>
            <input value={new_context} onChange={(e)=>set_new_context(e.target.value)}/>
        </div>
    )
})

export default EditContext;