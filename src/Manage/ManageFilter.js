import React, { useEffect, useRef, useState } from "react"
import event_handler from "../EventEmitter";
import {toast} from "react-toastify";
import env from "react-dotenv";

import "./Manage_Style.css";

const ManageFilter = (props)=>{
    const [filter,set_filter] = useState({title: "",genres: []})
    const has_ran_for_genre = useRef(false);

    const get_genres = async ()=>{
        try{
            const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_genre`).then(resp=>resp.json());
            let temp = result.map((value)=>{return {value , select: false}})
            set_filter({...filter,genres: temp});
        }
        catch(e){
            toast("Error while fetching genre list.",{type: "error"})
        }
    }

    const on_title_change = (e)=> set_filter({...filter,title : e.target.value});
    const on_genre_click = (index)=>{
        let temp =[...filter.genres];
        temp[index] = {...temp[index], select : !temp[index].select};
        set_filter({...filter,genres: [...temp]});
    }

    const on_apply_filter_click = ()=>{
        let selected_genres = [];
        for(let i=0;i<filter.genres.length;i++) { const {value,select} = filter.genres[i]; if(select) selected_genres.push(value) }
        //emitting the apply_filter event so all the registered functions could be called...
        event_handler.emit("af",{...filter,genres: selected_genres});
    }
    const on_reset_filter_click = ()=> {
        const obj = {title: "",genres: filter.genres.map((v)=>{return {...v,select:false}})}; 
        set_filter({...obj}); 
        event_handler.emit("af",{});
    }
    
    useEffect(()=>{
        if(has_ran_for_genre.current) return ;
        has_ran_for_genre.current = true;
        get_genres();
    },[])

    return(
        <div className="filters column_box">
            <label>Filters</label>
            <div className="grid_box list">
                <input value={filter.title} onChange={on_title_change} type="text" placeholder="Search by title"/>
                {filter.genres.map((v,i)=><button key={`genre - ${i}`} className={`${v.select ? "selected": ""}`} onClick={()=>on_genre_click(i)}>{v.value}</button>)}
            </div>
            <div className="operations">
                <button className="apply" onClick={on_apply_filter_click}>Apply Filter</button>
                <button className="reset" onClick={on_reset_filter_click}>Reset Filter</button>
            </div>
        </div>
    )
}

export default ManageFilter;