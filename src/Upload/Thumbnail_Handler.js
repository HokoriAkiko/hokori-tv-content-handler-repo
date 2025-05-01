import React, { forwardRef, useImperativeHandle, useState } from "react";
import "./Upload_Style.css";

const ThumbnailHandler = forwardRef((props,ref)=>{
    const [thumbnail,set_thumbnail] = useState("");
    let preview = { backgroundImage : "url(./uploadicon.png)" };
    const on_file_select = (e)=> set_thumbnail(e.target.files[0]);
    const make_style=()=> {if(thumbnail) preview = { backgroundImage : `url(${URL.createObjectURL(thumbnail)})`,backgroundSize: "cover" }}
    make_style();
    const on_reset = ()=> set_thumbnail("");
    const exposed = ()=>{
        return {
            key : "thumbnail",
            value: thumbnail,
            on_reset
        }
    }

    useImperativeHandle(ref,exposed);
    
    return(
        <div className="field_container column_box">
            <label>Thumbnail</label>
            <div className="thumbnail" style={preview}>
                <input type="file" accept=".png, .jpg, .jpeg" onChange={on_file_select}/>
            </div>
        </div>
    )
})

export default ThumbnailHandler;