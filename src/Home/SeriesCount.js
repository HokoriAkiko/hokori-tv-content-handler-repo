import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import env from "react-dotenv";

import "./Home_Style.css"

const SeriesCount = (props)=>{
    const [count,set_count] = useState(0);
    const has_ran = useRef(false);

    const handle_animation = (start,end,duration = 1000)=>{
        const rate = 60;
        const frames = Math.round(duration/rate); if(frames===0) return;
        let current_frame = 0;

        const id = setInterval(()=>{
            ++current_frame;
            const progress = current_frame / frames;
            set_count(Math.round(start + (end-start)*progress));

            if(current_frame >=frames) clearInterval(id);
        },rate);
    }

    useEffect(()=>{
        const get_count = async ()=>{
            try{
                const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_series_count`).then(resp=>resp.json());
                set_count(result);
                handle_animation(0,result,result * 100);
            }
            catch(e){toast("Error in Getting Residual Files Count",{type: "error"});}
        }
        if(has_ran.current) return;
        has_ran.current = true;
        get_count();
    },[])

    return(
        <div className="card series_count row_box flex_1_box">
            <div className="count">{count}</div>
            <div className="message">Series</div>
        </div>
    )
}

export default SeriesCount;