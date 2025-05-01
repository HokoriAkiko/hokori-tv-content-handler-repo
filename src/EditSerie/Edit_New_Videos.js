import React, { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import {toast} from "react-toastify";
import PreviewVideo from "./Preview";

import "./Edit_Serie_Style.css";

const EachNewVideo = (props)=>{
    const {files,set_files,index,set_modal} = props;
    const {file} = files[index];

    const [resolution,set_resolution] = useState("");
    const url = useMemo(()=>URL.createObjectURL(file), [file]);

    const handle_click = ()=> set_files(files.filter((_,i)=> i!== index ))
    const handle_name = (e)=>{
        let temp = [...files];
        temp[index].custom_name = e.target.value;
        set_files([...temp]);
    }
    const handle_metadata = (e)=>{
        if(!!resolution) return;
        e.target.currentTime = Math.random() * e.target.duration; 
        set_resolution(`${e.target.videoWidth} X ${e.target.videoHeight}`); 
    }
    const render_info = ()=>{
        return(
            <div className="info column_box flex_1_box">
                <div className="flex_1_box row_box">
                    <div className="name">Name</div>
                    <input type="text" value={files[index].custom_name} onChange={handle_name}/>
                </div>
                <div className="flex_1_box row_box">
                    <div className="name">Format</div>
                    <div className="value">{files[index].format}</div>
                </div>
                <div className="flex_1_box row_box">
                    <div className="name">Size</div>
                    <div className="value">{files[index].size}</div>
                </div>
                <div className="flex_1_box row_box">
                    <div className="name">Resolution</div>
                    <div className="value">{resolution}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="each row_box">
            <div className="my_position" >{`${index + 1} •`}</div>
            <div className="video_preview">
                <video src={url} onLoadedMetadata={handle_metadata}></video>
                <div className="show_video" onClick={()=>set_modal(<PreviewVideo url={url} set_modal={set_modal}/>)}></div>
            </div>
            {render_info()}
            <button onClick={handle_click} >Remove</button>
        </div>
    )
}

const EditNewVideos = forwardRef((props,ref)=>{
    const [files,set_files]=useState([]);

    const pass = {files,set_files , ...props};

    const clear = ()=>set_files([]);
    const already_exist = ({name,size})=>{
        return files.findIndex(({file})=>file.name === name && file.size === size) !== -1
    }
    const handle_change = (e)=>{
        const new_files = e.target.files;
        let temp =[],duplicate = false;;
        for(let i=0;i<new_files.length;i++){
            const current = new_files[i];
            if(!already_exist({name: current.name,size: current.size})){
                temp.push({
                    custom_name: current.name,
                    size: `${(current.size/1048576).toFixed(2)} MB`,
                    format: current.type.split("/")[1],
                    file: current,
                });
            }
            else{duplicate= true;}
        }
        if(duplicate) toast("Duplicate files found , Removed.",{type: "warning"});
        set_files([...files,...temp]);
    }
    const handle_empty = ()=>{
        if(files.length === 0) return <div className="center_box empty">Add New Files To View Them Here</div>
        return null;
    }

    const expose = ()=>{
        return {
            key: "new_videos",
            old: files,
            new: files,
            on_success_upload : clear,
            refresh: clear
        }
    }
    useImperativeHandle(ref,expose);

    return(
        <div className="videos column_box">
            <label>Videos</label>
            <div className="row_box">
            <div className="add_container flex_1_box">
                <input type="file" accept="video/mp4" onChange={handle_change} multiple/>
                <div className="center_box">Add Video</div>
            </div>
            <button className="flex_1_box remove_all" onClick={clear}>Remove All</button>
        </div>
            {handle_empty()}
            {files.map((_,i) =><EachNewVideo key={i} index={i} {...pass}/>)}
        </div>
    )
})

export default EditNewVideos;