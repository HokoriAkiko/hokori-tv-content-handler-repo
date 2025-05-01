import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import env from "react-dotenv";
import { SpinnerCircular } from "spinners-react";

import "./Edit_Serie_Style.css";

const EditThumbnail = forwardRef((props,ref)=>{
    const {title,season}= props;
    const [thumbnail,set_thumbnail] = useState({original_url: "",new_url: "",fetching: true});
    const has_ran = useRef(false);

    const get_thumbnail = async ()=>{ 
        const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_thumbnail`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title,season})
        }).then(resp=>resp.json());

        if(!!result){ set_thumbnail({fetching : false, original_url : `${env.REACT_APP_STORAGE_URL}${result}`, new_url:""}) }
        else{set_thumbnail({fetching : false, original_url : "", new_url: ""}) }
    }

    const handle_rendering = ()=>{
        if(thumbnail.fetching) return <div className="center_box spinner"><SpinnerCircular color="blue" speed={100} thickness={200}/></div>
        if(!!thumbnail.new_url) return <img src={thumbnail.new_url} alt="Thumbnail" />
        if(!!thumbnail.original_url) return <img src={thumbnail.original_url} alt="Thumbnail"/>
        return <div className="missing">Thumbnail Missing</div>
    }

    const handle_pick = (e)=>{
        const new_image = e.target.files[0];
        if(!!new_image){
            const url = URL.createObjectURL(new_image);
            set_thumbnail({...thumbnail,new_url: url,new_image});
        }
    }

    useEffect(()=>{
        if(has_ran.current) return;
        has_ran.current = true;
        get_thumbnail();
    },[]);

    const expose = ()=>{
        return {
            key: "thumbnail",
            old: thumbnail.original_url,
            new: thumbnail.new_image,
            refresh: get_thumbnail
        }
    }
    useImperativeHandle(ref,expose);
    
    return(
        <div className="field_container column_box">
            <label>Thumbnail</label>
            <div className="thumbnail">
                {handle_rendering()}
                <div className="icon"></div>
                {thumbnail.fetching ? <></>: <input type="file" onChange={handle_pick} accept="image/png , image/jpeg , image/jpg" title=""/>}
            </div>
        </div>
    )
})



export default EditThumbnail;