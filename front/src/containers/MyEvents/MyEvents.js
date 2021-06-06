import React from 'react'
import './MyEvents.css'
import {useDispatch, useSelector} from "react-redux";
import {NavLink} from "react-router-dom";

const MyEvents = () => {
    const user = useSelector(state => state.users.user)
    
    return (
        <div className={"MyEvents"}>
            <h1 className={"MyEvents__title"}>Привет {user.name}</h1>
            <div className={"MyEvents__menuBlock"}>
                {user && (
                    <NavLink to="/myEvents_applications" className="MyEvents__link">
                        Мои заявки
                    </NavLink>
                )}
                {user && (
                    <NavLink to="/myEvents_calendarEvents" className="MyEvents__link">
                        Мои встречи (переговорка)
                    </NavLink>
                )}
                {user && (
                    <NavLink to="/myEvents_instructions" className="MyEvents__link">
                        Мои инструкции
                    </NavLink>
                )}
            </div>
        </div>
    )
}


export default MyEvents