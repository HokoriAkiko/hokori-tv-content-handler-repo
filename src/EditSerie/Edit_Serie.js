import React, { useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../Header/Header";
import EditThumbnail from "./Edit_Thumbnail";
import EditTitle from "./Edit_Title";
import EditContext from "./Edit_Context";
import EditSeason from "./Edit_Season";
import EditStatus from "./Edit_Status";
import EditGenreList from "./Edit_Genre_List";
import EditVideos from "./Edit_Videos";
import EditNewVideos from "./Edit_New_Videos";
import EditSerieModal from "./Edit_Serie_Modal";

import "./Edit_Serie_Style.css"

const EditSerie = (props)=>{
    const { viewport, set_modal } = props;

    const location = useLocation();
    const navigate = useNavigate();

    const thumbnail_ref = useRef();
    const title_ref = useRef();
    const context_ref = useRef();
    const season_ref = useRef();
    const status_ref = useRef();
    const genre_list_ref = useRef();
    const videos_list_ref = useRef();
    const new_videos_list_ref = useRef();

    const common_refresh = ()=>{
        thumbnail_ref.current.refresh();
        context_ref.current.refresh();
        status_ref.current.refresh();
        genre_list_ref.current.refresh();
        videos_list_ref.current.refresh();
    }

    const refresh = async (new_info)=>{
        await navigate(".",{replace: true,state: new_info});
        common_refresh();
    }

    const handle_discard = ()=>{
        window.scrollTo({top: 0,behavior: "smooth"});
        const scroll_to_top = ()=>{
            if(window.scrollY === 0){
                toast("Discarded");
                title_ref.current.refresh();
                season_ref.current.refresh();
                new_videos_list_ref.current.refresh();
                common_refresh();
            }
            else{requestAnimationFrame(scroll_to_top)}
        }
        scroll_to_top(); //recursive
    }

    const handle_confirm = ()=>{
        const edits = {
            [title_ref.current.key] : {
                old: title_ref.current.old,
                new: title_ref.current.new
            },
            [context_ref.current.key] : {
                old: context_ref.current.old,
                new: context_ref.current.new
            },
            [season_ref.current.key] : {
                old: season_ref.current.old,
                new: season_ref.current.new
            },
            [status_ref.current.key] : {
                old: status_ref.current.old,
                new: status_ref.current.new
            },
            [thumbnail_ref.current.key] : {
                old: thumbnail_ref.current.old,
                new: thumbnail_ref.current.new
            },
            [genre_list_ref.current.key] : {
                old: genre_list_ref.current.old,
                new: genre_list_ref.current.new
            },
            [videos_list_ref.current.key] : {
                old: videos_list_ref.current.old,
                new: videos_list_ref.current.new
            },
            [new_videos_list_ref.current.key] : {
                old: new_videos_list_ref.current.old,
                new: new_videos_list_ref.current.new
            },
        };

        //start scrolling
        window.scrollTo({top: 0,behavior: "smooth"});

        const scroll_to_top = ()=>{
            if(window.scrollY === 0){ set_modal(<EditSerieModal data={edits} set_modal={set_modal} refresh={refresh} on_success_upload={new_videos_list_ref.current.on_success_upload}/>); }
            else{requestAnimationFrame(scroll_to_top)}
        }
        scroll_to_top(); //recursive
    }

    if(!!location.state.title && !!location.state.season){
        return(
            <>
            <Header />
            <div className="edit_serie">
                <div className="row_box">
                    <div className="left"></div>
                    <div className="mid">
                        <div className="column_box">
                        <label className="label_page">Edit Serie</label>
                        <div className="group_container">
                            <div className="left_section"><EditThumbnail {...location.state} ref={thumbnail_ref}/></div>
                            <div className="right_section">
                                <div className="column_box">
                                    <EditTitle {...location.state} ref={title_ref}/>
                                    <EditContext {...location.state} ref={context_ref}/>
                                    <EditSeason {...location.state} ref={season_ref}/>
                                    <EditStatus {...location.state} ref={status_ref}/>
                                </div>
                            </div>
                        </div>
                        <EditGenreList {...location.state} ref={genre_list_ref}/>
                        <EditVideos {...location.state} {...props} ref={videos_list_ref}/>
                        <EditNewVideos {...location.state} {...props} ref = {new_videos_list_ref}/>
                        <div className="operations row_box">
                            <button className="flex_1_box confirm" onClick={handle_confirm}>Confirm Edits</button>
                            <button className="flex_1_box discard" onClick={handle_discard}>Discard Edits</button>
                        </div>
                        </div>
                    </div>
                    <div className="right"></div>
                </div>
            </div>
            </>
        )
    }
    else{
        toast("Title and season not found , Rerouting to Home");
        navigate("/",{replace: true});
        return <></>
    }
}

export default EditSerie;