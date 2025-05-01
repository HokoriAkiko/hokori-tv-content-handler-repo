import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import env from "react-dotenv";
import {toast} from "react-toastify";

import "./Edit_Serie_Style.css";

const EachGenre = (props) => <button onClick={()=>props.handle_click(props.index)} className={`${props.genre.select ? "selected": ""}`}>{props.genre.value}</button>

const EditGenreList = forwardRef((props,ref)=>{
    const { title, season } = props;
    const [old_list,set_old_list] = useState([]);
    const [new_list,set_new_list] = useState([]);
    const has_ran = useRef(false);

    const get_list = async ()=>{
        try{
            const serie_genres = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
                method: "POST",
                headers: {"Content-Type" : "application/json" },
                body: JSON.stringify({title,season,fields:["genre_list"]})
            }).then(resp=>resp.json());

            const genres = await fetch(`${env.REACT_APP_STORAGE_URL}/get_genre`).then(resp=>resp.json());

            set_new_list(genres.result.map((g)=>{
                if(serie_genres.result.genre_list.findIndex((v)=> v===g) !== -1){
                    return {
                        value: g,
                        select: true
                    }
                }

                return {
                    value: g,
                    select: false,
                }
            }));
            set_old_list(serie_genres.result.genre_list);
        }
        catch(e){
            toast("Error while fetching genre list.",{type: "error"})
        }
    }

    const handle_click = (i)=>{
        let temp = [...new_list];
        temp[i].select = !temp[i].select;
        set_new_list([...temp]);
    }

    useEffect(()=>{
        if(has_ran.current) return;
        has_ran.current = true;
        get_list();
    },[])

    const expose = ()=>{
        return {
            key: "genre_list",
            old: old_list,
            new: new_list.filter(v=>v.select).map(v=>v.value),
            refresh: get_list
        }
    }
    useImperativeHandle(ref,expose);

    return(
        <div className="genres column_box">
            <label>Genres</label>
            <div className="grid_box list">
                {new_list.map((item,i)=><EachGenre index={i} genre={item} key={`new list - ${i}`} handle_click={handle_click}/>)}
            </div>
        </div>
    )
})

export default EditGenreList;