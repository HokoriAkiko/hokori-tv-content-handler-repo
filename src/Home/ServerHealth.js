import React, { useEffect, useState } from "react"
import { toast } from "react-toastify";
import env from "react-dotenv";

import "./Home_Style.css";

const CircularGauge = (props)=>{
    const { percent, label, fill_color } = props;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent * 0.01 * circumference);

    return(
        <div className="circular_gauge">
            <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={radius} fill="none" stroke="white" strokeWidth="10"/>
                <circle cx="100" cy="100" r={radius} fill="none" stroke={fill_color} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 100 100)"/>
                <text x="100" y="100" textAnchor="middle" fill={fill_color} fontSize={24}>{percent} %</text>
                <text x="100" y="125" textAnchor="middle" fill="gray">{label}</text>
            </svg>
        </div>
    )
}

const ServerHealth = (props)=>{
    const [health,set_health] = useState({
        cpu_load : 0,
        total_memory : -1,
        free_memory: -1,
        up_time: -1,
        cpu_count: -1,
        disk_time_percent: 0
    });

    const used_memory = health.total_memory - health.free_memory;
    const memory_percent = parseInt((used_memory * 100)/health.total_memory);

    useEffect(()=>{
        const id = setInterval(async ()=>{
            try{
                const { result }  = await fetch(`${env.REACT_APP_STORAGE_URL}/get_server_health`).then(resp=>resp.json());
                set_health({...result});
            }
            catch(e){toast("Server Health Fetch Error",{type: "error"});}
        }, 5 * 1000);

        return ()=>clearInterval(id);
    },[])

    const toGB = (v)=> v > 0 ? Math.round(v/1024/1024/1024) : 0;
    const render_uptime = (seconds)=>{
        const days = Math.floor(seconds / (24 * 3600));
        seconds %= (24 * 3600);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    const render_pairs = ()=>{
        return(
            <div className="pairs column_box flex_1_box center_box">
                <div className="each row_box"><label>CPU Cores</label><div>{toGB(health.cpu_count)}</div></div>
                <div className="each row_box"><label>Total RAM</label><div>{toGB(health.total_memory)}</div></div>
                <div className="each row_box"><label>Free RAM</label><div>{toGB(health.free_memory)}</div></div>
                <div className="each row_box"><label>USED RAM</label><div>{toGB(health.total_memory - health.free_memory)}</div></div>
                <div className="each row_box"><label>System Uptime</label><div>{render_uptime(health.up_time)}</div></div>
            </div>
        )
    }
    

    return(
        <div className="server_health column_box flex_1_box">
            <label>Server Health</label>
            <div className="row_box">
                <div className="gauge_card"><CircularGauge percent={health.cpu_load} fill_color="orange" label="CPU"/></div>
                <div className="gauge_card"><CircularGauge percent={memory_percent} label="RAM" fill_color="green"/></div>
                <div className="gauge_card"><CircularGauge percent={Math.round(health.disk_time_percent)} label="Disk" fill_color="blue"/></div>
                {render_pairs()}
            </div>
        </div>
    )
}

export default ServerHealth;