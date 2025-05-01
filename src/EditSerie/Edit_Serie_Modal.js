import React, { useEffect, useRef, useState } from "react";
import { SpinnerCircular } from "spinners-react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import env from "react-dotenv"

import "./Edit_Serie_Style.css";

const EditSerieModal = (props)=>{
    const { data, set_modal, refresh, on_success_upload } = props; 
    const [progress_index,set_progress_index] = useState(0);
    const [new_videos_uploaded,set_new_videos_uploaded] = useState(0);
    const has_ran = useRef();
    const [editing,set_editing] = useState(false);

    const progress_list = [
        "Editing Serie Info",
        "Updating Thumbnail",
        "Updating Old Videos",
        "Uploading New Videos"
    ]

    //step 1 
    const update_serie_info = async ()=>{
        const { result, error, info }= await fetch(`${env.REACT_APP_STORAGE_URL}/update_serie_info`,{ 
            method: "POST", 
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                title : data.title,
                context: data.context,
                season: data.season,
                status: data.status,
                genre_list : data.genre_list,
            }), 
        }
        ).then(resp=>resp.json());

        if(!!result) set_progress_index(1); refresh({...info});
        if(!!error) throw new Error(error);
    }

    //step 2
    const update_thumbnail = async ()=>{
        const fd = new FormData();
        fd.append("title",data.title.new);
        fd.append("thumbnail",data.thumbnail.new);
        fd.append("season", data.season.new);

        const { result, error, info }= await fetch(`${env.REACT_APP_STORAGE_URL}/update_thumbnail`,{ 
            method: "POST", 
            body: fd, 
        }).then(resp=>resp.json());

        if(!!result) set_progress_index(2); refresh({...info});
        if(!!error) throw new Error("Error in updating thumbnail");
    }

    //step 3
    const update_old_videos = async ()=>{
        const { result, error, info } = await fetch(`${env.REACT_APP_STORAGE_URL}/update_video`,{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({ 
                title : data.title.new,
                season: data.season.new,
                old_videos : !!data.videos ? data.videos.new.map((v)=>v.current) : [],
            })
        }).then(resp=>resp.json());

        if(!!result) set_progress_index(3); refresh({...info});
        if(!!error) throw new Error("Error in updating old videos");
    }

    //step 4
    const upload_new_videos = async ()=>{
        const new_videos = !!data.new_videos  && !!data.new_videos.new ? data.new_videos.new : []
        for await (const current of new_videos){
            const fd = new FormData();
            fd.append("custom_name",current.custom_name);
            fd.append("video",current.file);
            fd.append("title",data.title.new);
            fd.append("season",data.season.new);

            const { result, error, info } = await fetch(`${env.REACT_APP_STORAGE_URL}/upload_video`,{
                method: "POST",
                body: fd
            }).then(resp=>resp.json());

            if(!!result) { refresh({...info}); set_new_videos_uploaded(prev => prev+1); }
            if(!!error) throw new Error("Error in uploading new videos");
        }
    
        // all new videos uploaded successfully
        set_progress_index(4); 
        on_success_upload(); // reset newly added video files list
    }

    const start_sequence = async ()=>{
        try{
            set_editing(true);
            await update_serie_info().then(update_thumbnail).then(update_old_videos).then(upload_new_videos);
            set_editing(false);
        }
        catch(e){
            toast(e?.message,{type: "error"});
            set_progress_index(-1);
            set_editing(false);
        }
    }

    useEffect(()=>{
        if(has_ran.current) return ;
        has_ran.current = true;
        start_sequence();
    },[])

    const render_progress = ()=>{
        const render_icon = (i)=>{
            if(i < progress_index) return <img src="./tick_icon.png" alt="tick"/>
            if(i === progress_index) return <SpinnerCircular size={25} color={"rgba(0,100,200,1)"} thickness={200} />
            return <SpinnerCircular size={25} color={"gray"} thickness={200} still={true}/>
        }
        const render_message = (v,i)=> i === 2 ? `${v} ${new_videos_uploaded}/${!!data.new_videos && data.new_videos.new ? data.new_videos.new.length : 0}` : v;
        return progress_list.map((v,i)=>{
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
                    <NavLink className={`link_style flex_1_box ${editing ? "":"disabled"}`} onClick={()=>set_modal(null)}>Back</NavLink> 
                    <NavLink  
                        to={`${env.REACT_APP_CLIENT_URL}/watch?title=${decodeURIComponent(data.title)}&season=${decodeURIComponent(data.season)}`}
                        className={`link_style flex_1_box ${progress_index < 4 ? "disabled":"" }`}
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

export default EditSerieModal;