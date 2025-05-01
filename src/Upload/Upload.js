import React , {useRef} from "react"
import Header from "../Header/Header"
import ThumbnailHandler from "./Thumbnail_Handler"
import TitleHandler from "./Title_Handler"
import ContextHandler from "./Context_Handler"
import SeasonHandler from "./Season_Handler"
import GenreListHandler from "./Genre_List_Handler"
import VideoListHandler from "./Video_List_Handler"
import StatusHandler from "./Status_Handler"
import UploadingModal from "./Uploading_Modal_Handler"

import "./Upload_Style.css"

const Upload = (props)=>{
    const thumbnail_ref = useRef();
    const title_ref = useRef();
    const context_ref = useRef();
    const status_ref = useRef();
    const season_ref = useRef();
    const genre_ref = useRef();
    const videos_ref = useRef();
    const pass ={...props};

    let form_style={
        width : props.viewport.width <1000 ? "100%" : 1000
    }

    const on_reset = ()=>{
        thumbnail_ref.current.on_reset();
        title_ref.current.on_reset();
        context_ref.current.on_reset();
        status_ref.current.on_reset();
        season_ref.current.on_reset();
        genre_ref.current.on_reset();
        videos_ref.current.on_reset();
    }

    const handle_send = ()=>{
        const upload = {
            [thumbnail_ref.current.key] : thumbnail_ref.current.value,
            [title_ref.current.key] : title_ref.current.value,
            [context_ref.current.key] : context_ref.current.value,
            [status_ref.current.key] : status_ref.current.value,
            [season_ref.current.key] : season_ref.current.value,
            [genre_ref.current.key] : genre_ref.current.value,
            [videos_ref.current.key] : videos_ref.current.value,
        }
        props.set_modal(<UploadingModal {...props} upload={upload}/>)
    }

    return(
        <>
        <Header />
        <div className="upload">
            <div className="row_box">
                <div className="left"></div>
                <div className="mid column_box">
                    <label className="label_page">Upload Serie</label>
                    <div className="group_container">
                        <div className="left_section"> <ThumbnailHandler {...pass} ref={thumbnail_ref}/> </div>
                        <div className="right_section">
                            <div className="column_box flex_1_box">
                                <TitleHandler {...pass} ref={title_ref}/>
                                <ContextHandler {...pass} ref={context_ref}/>
                                <SeasonHandler {...pass} ref={season_ref}/>
                                <StatusHandler {...pass} ref={status_ref}/>
                            </div>
                        </div>
                    </div>
                    <GenreListHandler {...pass} ref={genre_ref}/>
                    <VideoListHandler {...pass} ref={videos_ref}/>
                    <div className="operations row_box">
                        <button className="flex_1_box upload" onClick={handle_send}>Upload</button>
                        <button className="flex_1_box reset" onClick={on_reset}>Reset</button>
                    </div>
                </div>
                <div className="right"></div>
            </div>
        </div>
        </>
    )
}

export default Upload;