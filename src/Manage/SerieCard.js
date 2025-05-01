import React, { useEffect, useRef, useState } from "react";
import env from "react-dotenv"
import { NavLink } from "react-router-dom";
import {SpinnerCircular} from "spinners-react"
import "./Manage_Style.css";

const FloatingCard = (props)=>{
    const {gap, title,context,genre_list,videos,season,status} = props;

    let my_style={
        left: gap.gap_in_right > 400 ? "100%" : "-100%",
        top:gap.gap_in_bottom > 350 ? "25%" : "-25%"
    };

    const render_genres = ()=> genre_list.map((v,i)=>i === genre_list.length - 1 ? <div>{v}.</div>: <div>{v}</div>) ?? "N.A."
    const render_navs = ()=>{
        return(
            <div className="flex_1_box">
                <NavLink to="/edit" state={{title,season}} className="nav_link center_box flex_1_box">Edit</NavLink>
                <NavLink 
                    to={`${env.REACT_APP_CLIENT_URL}/watch?title=${decodeURIComponent(title)}&season=${decodeURIComponent(season)}`} 
                    className="nav_link center_box flex_1_box"
                    target="_blank"
                    rel="noopener noreferrer"
                >Watch</NavLink>
            </div>
        )
    }
    
    return (
        <div className="floating column_box" style={my_style}>
            <div className="title">{title}</div>
            <div className="context text_overflow_box">{context ?? "N.A."}</div>
            <div className="other wrap_box" key={1}>Status: <div>{!!status ? status : "N.A."}</div></div>
            <div className="other wrap_box"key={2}>Season: <div>{season}</div></div>
            <div className="other wrap_box"key={3}>Episodes: <div>{videos?.length}</div></div>
            <div className="other wrap_box"key={4}>Genre: {render_genres()}</div>
            {render_navs()}
        </div>
    )
}

const SerieCard = (props)=>{
    const { title, season, viewport } = props;
    const [thumbnail,set_thumbnail] = useState({fetching: true,url : ""});
    const [gap,set_gap]= useState(null);
    const [info,set_info]= useState();
    const has_ran = useRef(false);

    const get_info = async ()=>{
        const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, season, fields: ["context","videos","genre_list","status"] })
        }).then(resp=>resp.json());
        set_info(result);
    }

    const get_thumbnail = async ()=>{
        const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_thumbnail`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title,season})
        }).then(resp=>resp.json());

        if(!!result){ set_thumbnail({fetching : false, url : `${env.REACT_APP_STORAGE_URL}${result}`}) }
        else{set_thumbnail({fetching : false, url : ""}) }
    }

    const on_enter = (e)=>{
        const gap_in_right = viewport.width - e.clientX;
        const gap_in_bottom = viewport.height - e.clientY;
        set_gap({gap_in_right,gap_in_bottom});
    }
    
    useEffect(()=>{
        if(has_ran.current) return;
        has_ran.current = true;
        get_info();
        get_thumbnail();
    },[])
    
    
    const render_thumbnail  = ()=>{
        if(thumbnail.fetching) return <div className="spinner center_box"><SpinnerCircular color="blue" speed={100} thickness={200}/></div>
        if(thumbnail.url) return <img src={thumbnail.url} alt="Thumbnail"/>
        return <div className="missing center_box">Thumbnail Missing</div>
    }

    const render_info = ()=>{
        return(
            <div className="info reverse_column_box">
                <div className="title text_overflow_box">{title}</div>
                <div className="center_box">
                    <div className="other">{`S ${season}`}</div>
                    <div className="other">{`Eps ${!!info &&  !!info.videos ? info.videos.length : 0}`}</div>
                </div>
            </div>
        )
    }

    return(
        <div className="each" onMouseEnter={on_enter} onMouseLeave={()=>set_gap(null)}>
            <div className="thumbnail">{render_thumbnail()}</div>
            <div className="info">{render_info()}</div>
            {gap ? <FloatingCard gap={gap} {...props} {...info}/> : null}
        </div>
    )
}

export default SerieCard;