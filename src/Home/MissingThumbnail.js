import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import env from "react-dotenv";

import "./Home_Style.css"

const MissingThumbnail = (props)=>{
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

    const handle_count_color = (v)=>{
        const clamp = Math.min(Math.max(0,v),100);
        const red = Math.round((clamp/100)*255);
        const green = Math.round(((100-clamp)/100)*255);
        return `rgba(${red} ${green} 0)`;
    }

    useEffect(()=>{
        const get_count = async ()=>{
            try{
                const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/missing_thumbnails`).then(resp=>resp.json());
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
        <button className="card lack column_box flex_1_box" title="Click to View">
            <div className="count" style={{color: handle_count_color(count)}}>{count}</div>
            <div className="message">Series have missing thumbnails</div>
        </button>
    )
}

export default MissingThumbnail;