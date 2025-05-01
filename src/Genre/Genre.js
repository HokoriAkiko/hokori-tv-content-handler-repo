import React, { useEffect, useState } from "react"
import env from "react-dotenv";
import { toast } from "react-toastify";
import Header from "../Header/Header"

import "./Genre_Style.css"

const ADD_POSITION = "add";
const MAIN_POSITION = "list"

const AddGenre = (props)=>{
    const {genre,set_genre} = props;
    const [new_genre,set_new_genre] = useState("");

    const test_list = (arr)=>{
        const reg = new RegExp(`^\\s*${new_genre}\\s*$`, "i");
        for(let i=0;i<arr.length;i++) { if(reg.test(arr[i])){return true;} }
        return false;
    }

    const already_present = ()=> test_list(genre.list) || test_list(genre.remove.map((v)=>v.my_value)) || test_list(genre.add);
    const handle_click = ()=>{
        if(already_present()){toast(`${new_genre} Already Present`,{type: "warning"}); return;}
        if(!!new_genre && !!new_genre.length) set_genre({...genre,add: [...genre.add,new_genre]}); set_new_genre("");   
    }
    const on_enter_press = (e)=> e.key === "Enter" ? handle_click() : null;

    return(
        <div className="row_box add_genre">
            <input placeholder="Add Genre" value={new_genre} onChange={(e)=>set_new_genre(e.target.value)} onKeyDown={on_enter_press}/>
            <button onClick={handle_click}>Add</button>
        </div>
    )
}

const AddGenreList = (props) =>{
    const { genre, set_genre } = props;
    const handle_click = (e)=>{
        let temp_add = [] , temp_remove = [...genre.remove,{my_value: e.target.outerText,my_position: ADD_POSITION}];
        for(let i=0;i<genre.add.length;i++) { if(e.target.outerText !== genre.add[i]){temp_add.push(genre.add[i])} }
        set_genre({...genre, add : [...temp_add] , remove : [...temp_remove]});
    }

    if(!!props.genre.add.length)
    {
        return(
            <div className="section column_box">
                <label>New Genres</label>
                <div className="grid_box container">{props.genre.add.sort().map((v,i)=><button key={`old-each-${i}`} onClick={handle_click}>{v}</button>)}</div>
            </div>
        )
    }
    return <></>
}

const PendingRemoveGenreList = (props) =>{
    const { genre, set_genre } = props;

    const handle_click = (_,i)=>{
        const { my_value, my_position } = genre.remove[i];
        let temp_remove = genre.remove.filter((v)=>v.my_value !== my_value);
        let old_location = [...genre[my_position],my_value];
        set_genre({...genre,remove : [...temp_remove] , [my_position] : [...old_location]});
    }

    if(!!genre.remove.length)
    {
        return(
            <div className="section column_box">
                <label>Remove Genres</label>
                <div className="grid_box container">{genre.remove.sort().map((v,i)=><button key={`old-each-${i}`} onClick={(_)=>handle_click(_,i)}>{v.my_value}</button>)}</div>
            </div>
        )
    }
    return <></>
}

const GenreList = (props) =>{
    const { genre, set_genre } = props;

    const handle_click = (e)=>{
        let temp_list = genre.list.filter((v)=>v !== e.target.outerText);
        let temp_remove = [...genre.remove , {my_value: e.target.outerText,my_position : MAIN_POSITION}];
        set_genre({...genre,list: [...temp_list],remove : [...temp_remove]});
    }

    if(!!props.genre.list.length){
        return(
            <div className="section column_box">
                <label>Current Genres</label>
                <div className="grid_box container">{props.genre.list.sort().map((v,i)=><button key={`old-each-${i}`} onClick={handle_click}>{v}</button>)}</div>
            </div>
        )
    }
    return <></>
}

const Genre = (props)=>{
    const [genre,set_genre] = useState({ list : [], add: [], remove: [] });

    const get_genres = async ()=>{
        try{
            const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_genre`).then(resp=>resp.json());
            set_genre({...genre, list : result})
        }
        catch(e){ toast("Error while fetching genre list.",{type: "error"}); }
    }

    const update_genres = async ()=>{
        try {
            const final = [...genre.list,...genre.add];
            await fetch(`${env.REACT_APP_STORAGE_URL}/update_genre`, { method:"POST", headers: {"Content-Type" : "application/json"}, body : JSON.stringify(final) }).then(data=>data.json());
            toast("Update Successful"); set_genre({list : final,add: [],remove: []})
        }
        catch(e){ toast("Error while updating genre list",{type: "error"}); }
    }

    useEffect(()=>{ get_genres(); },[])

    return(
        <>
        <Header />
        <div className="manage_genres">
            <div className="row_box">
                <div className="left"></div>
                <div className="mid column_box">
                    <label>Manage Genres</label>
                    <AddGenre genre={genre} set_genre={set_genre}/>
                    <GenreList genre={genre} set_genre={set_genre}/>
                    <AddGenreList genre={genre} set_genre={set_genre}/>
                    <PendingRemoveGenreList genre={genre} set_genre={set_genre}/>
                    {!!genre.add.length || !!genre.remove.length ? <button className="update" onClick={update_genres}>Update</button>: null}
                </div>
                <div className="right"></div>
            </div>
        </div>
        </>
    )
}

export default Genre;