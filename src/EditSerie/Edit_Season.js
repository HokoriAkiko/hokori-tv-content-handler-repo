import React, { forwardRef, useImperativeHandle, useState } from "react";

import "./Edit_Serie_Style.css";

const EditSeason = forwardRef((props,ref)=>{
    const {season} = props;
    const[new_season,set_new_season] = useState(season);

    
    const handle_change = (e)=>{
        const value = Number(e.target.value.replace(/[^0-9]/g, ""));
        set_new_season(value);
    }
    const expose = ()=>{
        return {
            key: "season",
            old: season,
            new: new_season,
            refresh: ()=>set_new_season(season)
        }
    }
    useImperativeHandle(ref,expose);

    return(
        <div className="field_container row_box season">
            <label>Season</label>
            <input type="text" value={new_season} onChange={handle_change}/>
        </div>
    )
})

export default EditSeason;