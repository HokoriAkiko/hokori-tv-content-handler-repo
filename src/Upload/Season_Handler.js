import React, { forwardRef, useImperativeHandle, useState } from "react"
import "./Upload_Style.css"

const SeasonHandler = forwardRef((props,ref)=>{
    const [season,set_season] = useState(0);
    const on_reset = ()=> set_season(0);
    const handle_season = (e)=> set_season(Number(e.target.value.replace(/[^0-9]/g, "")));

    const expose = ()=>{
        return {
            key: "season",
            value: season,
            on_reset
        }
    }
    useImperativeHandle(ref,expose);

    return(
        <div className="field_container season row_box">
            <label>Season</label>
            <input type="text" value={season} onChange={handle_season} placeholder="0"/>
        </div>
    )
})

export default SeasonHandler;