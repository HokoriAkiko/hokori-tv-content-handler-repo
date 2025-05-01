import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import env from "react-dotenv";
import {toast} from "react-toastify";
import "./Upload_Style.css"

const GenreListHandler = forwardRef((props,ref)=>{
    const [genre_list,set_genre_list] = useState([]);

    const get_list = async ()=>{
        try{
            const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_genre`).then(resp=>resp.json());
            result.sort();
            set_genre_list(result.map((v)=>{return {value: v,select: false}}))
        }
        catch(e){toast("Error fetching genre list.",{type: "error"})}
        
    }

    const on_reset = ()=>{
        let temp = genre_list.map((v)=>{return {value: v.value, select: false}})
        set_genre_list(temp);
    }

    const expose = ()=>{
        return {
            key: "genre_list",
            value: genre_list,
            on_reset
        }
    }
    
    const handle_click = (i)=>{ let temp = genre_list; temp[i].select = !temp[i].select; set_genre_list([...temp]); }
    
    useEffect(()=>{
        get_list();
    },[])

    useImperativeHandle(ref,expose);

    return(
        <div className="genres column_box">
            <label>Genres</label>
            <div className="grid_box list">{genre_list.map((v,i)=><button key={`v.value - ${i}`} className={`${v.select ? "selected": ""}`} onClick={()=>handle_click(i)}>{v.value}</button>)}</div>
        </div>
    )
})

export default GenreListHandler;