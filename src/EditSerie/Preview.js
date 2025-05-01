import React from "react"

import "./Edit_Serie_Style.css"

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

export default PreviewVideo;