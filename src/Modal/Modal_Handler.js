import React, { useLayoutEffect, useState } from "react";
import "./Modal_Style.css";

const ModalHandler = (props)=>{
    const { modal, viewport } = props;
    const [modal_style,set_modal_style] = useState({});

    useLayoutEffect(()=>{
        if(!!modal){ document.body.style.overflow = "hidden"; set_modal_style({ ...viewport, top: window.scrollY, left: 0 });}
        else{ document.body.style.overflow = "auto"; set_modal_style({});}
    },[ modal, viewport ])

    return <div className="modal_box" style={modal_style}> {modal} </div>
}

export default ModalHandler;