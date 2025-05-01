import React, { useEffect, useRef, useState } from "react"
import env from "react-dotenv"
import { toast } from "react-toastify"
import { SpinnerCircular } from "spinners-react"
import { NavLink } from "react-router-dom"

import "./Upload_Style.css"

const UploadingModal = (props)=>{
    const { upload, set_modal } = props;
    const has_run = useRef(false);

    const [progress_index, set_progress_index] = useState(0);
    const [video_uploading_count,set_video_uploading_count] = useState(0);
    const progress = [ "Uploading Serie info", "Uploading Thumbnail", "Uploading Videos"];

    //step 1 : send basic data 
    const handle_serie_info_fetch = async ()=>{
        const fd = new FormData();
        fd.append("title", upload.title);
        fd.append("context", upload.context);
        fd.append("season",upload.season);
        fd.append("status",upload.status);
        for(let i=0;i<upload.genre_list.length;i++){
            if(upload.genre_list[i].select){fd.append("genre_list",upload.genre_list[i].value)}
        }

        const {error} = await fetch(`${env.REACT_APP_STORAGE_URL}/upload_serie_info`,{
            method: "POST",
            body: fd
        }).then(data=>data.json());

        if(!!error) throw error;
        set_progress_index(prev=>prev + 1);
    }

    //step 2 send thumbnail image
    const handle_thumbnail_fetch = async ()=>{
        const fd = new FormData(); 
        fd.append("title",upload.title);
        fd.append("season",upload.season);
        fd.append("thumbnail",upload.thumbnail);

        const { error } = await fetch(`${env.REACT_APP_STORAGE_URL}/upload_thumbnail`,{
            method: "POST",
            body: fd
        }).then(data=>data.json());

        if(!!error) throw error;
        set_progress_index(prev=>prev + 1);
    }

    //step 3 send video file one by one
    const handle_video_fetch = async ()=>{
        for await (const current of upload.videos) {
            const fd = new FormData();
            fd.append("video", current.file);
            fd.append("custom_name", current.custom.name);
            fd.append("title",upload.title);
            fd.append("season",upload.season);
            const from_back = await fetch(`${env.REACT_APP_STORAGE_URL}/upload_video`,{
                method: "POST",
                body: fd
            }).then(data=>data.json());
                
            if(!!from_back.error) throw from_back.error;
            set_video_uploading_count(prev=>prev+1);
        }
        set_progress_index(prev=>prev + 1);
    }

    //main function who handles makes all fetch calls , step -1 , 2 ,3
    const send_data = async ()=>{
        try {
            await handle_serie_info_fetch();
            await handle_thumbnail_fetch();
            await handle_video_fetch();
        }
        catch(e){
            toast(e,{type: "error"});
            set_progress_index(_ => -1);
            return;
        }
    }

    //this ensures that fetch call is made only once
    useEffect(()=>{
        if(has_run.current) return ;
        has_run.current = true;
        send_data();
    },[])

    const render_progress = ()=>{
        const render_icon = (i)=>{
            if(i < progress_index) return <img src="./tick_icon.png" alt="tick"/>
            if(i === progress_index) return <SpinnerCircular size={25} color={"rgba(0,100,200,1)"} thickness={200} />
            return <SpinnerCircular size={25} color={"gray"} thickness={200} still={true}/>
        }
        const render_message = (v,i)=> i === 2 ? `${v} ${video_uploading_count}/${upload?.videos?.length ?? 0}` : v;
        return progress.map((v,i)=>{
            return(
                <div className="row_box each">
                    <div className="position">{`${i+1}•`}</div>
                    <div className="message">{render_message(v,i)}</div>
                    <div className="icon center_box">{render_icon(i)}</div>
                </div>
            )
        })
    }

    const render_buttons = ()=>{
        return(
            <div className="button_container reverse_column_box">
                <div className="row_box"> 
                    <NavLink className={`link_style flex_1_box ${progress_index === -1 || progress_index === 3 ? "":"disabled" }`} onClick={()=>set_modal(null)}>Back</NavLink> 
                    <NavLink  
                        to={`${env.REACT_APP_CLIENT_URL}/watch?title=${decodeURIComponent(upload.title)}&season=${decodeURIComponent(upload.season)}`}
                        className={`link_style flex_1_box ${progress_index < 3 ? "disabled":"" }`}
                        rel="noopener noreferrer"
                        target="_blank"
                    >Watch</NavLink> 
                </div> 
            </div>
        )
    }

    return(
        <div className="uploading">
            <div className="row_box">
                <div className="left center_box">Viewport too small</div>
                <div className="mid center_box">
                    <div className="container column_box">
                        <label>Uploading</label>
                        {render_progress()}
                        {render_buttons()}
                    </div>
                </div>
                <div className="right"></div>
            </div>
        </div>
    )
}

export default UploadingModal;