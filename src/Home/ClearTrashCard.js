import React, { useEffect, useRef, useState } from "react"
import env from "react-dotenv";
import { toast } from "react-toastify";

const ClearTrash = (props)=>{
    const [deleting,set_deleting] = useState(false);
    const [residuals,set_residuals] = useState(0);
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

    const handle_deletion = async ()=>{
        if(deleting || count === 0) return;

        const handle_delete = async ()=>{
            try{
                set_deleting(true);
                await fetch(`${env.REACT_APP_STORAGE_URL}/residual_files`,{method:"DELETE"});
                handle_animation(count,0,residuals * 100);set_residuals(0);
                set_deleting(false);
            }
            catch(e){toast("Error in Deleting Residual Files",{type:"error"});set_deleting(false);}
        }
        handle_delete();
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
                const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/residual_files`).then(resp=>resp.json());
                set_residuals(result);
                handle_animation(0,result,result * 100);
            }
            catch(e){toast("Error in Getting Residual Files Count",{type: "error"});}
        }
        if(has_ran.current) return;
        has_ran.current = true;
        get_count();
    },[])

    return(
        <button className="card trash column_box" onClick={handle_deletion} title="Click to Delete">
            <div className="count" style={{color: handle_count_color(count)}}>{count}</div>
            <div className="message">Residual Files Found</div>
        </button>
    )
}



export default ClearTrash;