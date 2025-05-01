import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import env from "react-dotenv";
import PreviewVideo from "./Preview";

import "./Edit_Serie_Style.css"

const EachVideo = forwardRef((props,ref)=>{
    const { index, token,old_name } = props;
    const [new_name,set_new_name] = useState(old_name);
    const [remove,set_remove] = useState(false);
    const clip_ref = useRef();

    const handle_mouse_enter = ()=>{
        const my_clip = clip_ref.current;
        if(my_clip && my_clip.readyState >= 3){
            my_clip.loop = true;
            my_clip.play();
        }
    }
    const handle_mouse_leave = ()=>{
        const my_clip = clip_ref.current;
        if(my_clip){
            my_clip.pause();
            my_clip.loop = false;
        }
    }
    const handle_click = ()=> props.set_modal(<PreviewVideo {...props} url={`${env.REACT_APP_STORAGE_URL}/stream_video/${token}/false`}/>)

    const expose = ()=>{
        return { new_name, remove, index } 
    }
    useImperativeHandle(ref,expose);

    return(
        <div className="each row_box">
            <div className="my_position">{`${index+1}•`}</div>
            <div className="video_preview" onMouseEnter={handle_mouse_enter} onMouseLeave={handle_mouse_leave} onClick={handle_click}> 
                <video preload="metadata" src={`${env.REACT_APP_STORAGE_URL}/stream_video/${token}/true`} ref={clip_ref} muted/>
                <div className="show_video"></div>
                {remove ? <div className="slash"></div> : null}
            </div>
            <div className="info column_box flex_1_box">
                <div className="flex_1_box row_box">
                    <div className="name">Name</div>
                    <input value={new_name} onChange={(e)=>set_new_name(e.target.value)} placeholder="Enter Name"/>
                </div>
            </div>
            <button className={`${remove ? "mark":""}`} onClick={()=>set_remove(!remove)}>{remove ? "Marked": "Mark To Remove"}</button>
        </div>
    )
})

const EditVideos = forwardRef((props,ref)=>{
    const { title, season } = props;
    const [info,set_info] = useState();
    const has_ran = useRef();
    const videos_ref = useRef([]);

    const get_serie = async ()=>{
        const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({title,season,fields: ["videos","custom_names"]})
        }).then(resp=>resp.json());
        
        videos_ref.current = !!result.videos ? result.videos.map(()=>React.createRef()) : [];
        set_info(result);
    }

    const expose = ()=>{
        return {
            key: "videos",
            new: videos_ref.current,
            old: videos_ref.current,
            refresh: get_serie
        }
    }
    useImperativeHandle(ref,expose);

    useEffect(()=>{
        if(has_ran.current) return;
        has_ran.current = true;
        get_serie();
    })

    return(
        <div className="videos column_box">
            <label>Previously Added</label>
            {info && info.videos ? info.videos.map((v,i)=><EachVideo ref={videos_ref.current[i]} index={i} key={v} token={v} old_name={info.custom_names[i]} {...props}/>) : null}
        </div>
    )
})

export default EditVideos;