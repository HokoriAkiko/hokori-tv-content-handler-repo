import React, {  forwardRef, useImperativeHandle, useMemo, useState } from "react"
import "./Upload_Style.css"

const PreviewVideo = (props)=>{
    return(
        <div className="preview">
            <div className="row_box">
                <div className="left center_box">Viewport too small</div>
                <div className="mid center_box"><video src={props.url} poster={props.poster} controls></video></div>
                <div className="right center_box"> <div className="container"><button onClick={()=>props.set_modal(null)}>X</button></div> </div>
            </div>
        </div>
    )
}

const EachVideo = (props)=>{
    const {videos, viewport, set_modal, set_videos, my_index }= props;
    const {file,custom: {name, format, size}} = videos[my_index];
    
    const [resolution,set_resolution] = useState("");
    const url = useMemo(()=>URL.createObjectURL(file), [file]);
    
    const handle_name = (e)=> set_videos(arr=>arr.map((v,i)=> i === my_index ? {...v,custom: {...v.custom, name : e.target.value }} : v ));
    const handle_preview = ()=> set_modal(<PreviewVideo url={url} set_modal={set_modal} viewport={viewport}/>)
    const handle_remove = ()=> set_videos(arr=> arr.filter((_,i)=> my_index !== i));
    const handle_metadata = (e)=>{
        if(!!resolution) return;
        e.target.currentTime = Math.random() * e.target.duration; 
        set_resolution(`${e.target.videoWidth} X ${e.target.videoHeight}`); 
    }


    return (
        <div className="each row_box">
            <div className="my_position" >{`${my_index + 1} •`}</div>
            <div className="video_preview">
                <video onLoadedMetadata={handle_metadata} src={url}></video>
                <div className="show_video" onClick={handle_preview}></div>
            </div>
            <div className="info column_box flex_1_box">
                <div className="flex_1_box row_box">
                    <div className="name">Name</div>
                    <input type="text" value={name} onChange={handle_name}/>
                </div>
                <div className="flex_1_box row_box">
                    <div className="name">Format</div>
                    <div className="value">{format}</div>
                </div>
                <div className="flex_1_box row_box">
                    <div className="name">Size</div>
                    <div className="value">{size}</div>
                </div>
                <div className="flex_1_box row_box">
                    <div className="name">Resolution</div>
                    <div className="value">{resolution}</div>
                </div>
            </div>
            <button onClick={handle_remove} >Remove</button>
        </div>
    )
}

const AddVideo = (props)=>{
    const {videos,set_videos} = props;

    const handle_add_video = (e)=>{
        const new_files = e.target.files || [];
        let temp =[];

        for(let i=0; i < new_files.length; i++){
            const current = new_files[i];
            const {type,size} = current;
            temp.push({
                file: current,
                custom: {
                    name: current.name,
                    format: type.split("/")[1],
                    size: `${(size / (1024 * 1024)).toFixed(2)} MB`
                }
            })
        }
        set_videos([...videos,...temp]);
    }

    return(
        <div className="row_box">
            <div className="add_container flex_1_box">
                <input type="file" accept="video/mp4" onChange={handle_add_video} multiple/>
                <div className="center_box">Add Video</div>
            </div>
            <button className="flex_1_box remove_all" onClick={()=>set_videos([])}>Remove All</button>
        </div>
    )
}

const VideoListHandler = forwardRef((props,ref)=>{
    const [videos,set_videos] = useState([]);
    const pass = {videos,set_videos,...props};
    const on_reset =()=> set_videos([]);
    const expose = ()=>{
        return {
            key: "videos",
            value: videos,
            on_reset
        }
    }
    useImperativeHandle(ref,expose);

    return(
        <div className="videos column_box">
            <label>Videos</label>
            <AddVideo {...pass}/>
            {videos.map((_,i) =><EachVideo key={i} my_index={i} {...pass}/>)}
        </div>
    ) 
})

export default VideoListHandler;