import React from 'react'
import './MyEvents.css'
import { useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import ButtonPink from "../../components/UI/Buttons/ButtonPink/ButtonPink"

const MyEvents = () => {
    const user = useSelector(state => state.users.user)
    
    return (
        <div className={"MyEvents"}>
            <h1 className={"MyEvents__title"}>Привет {user.name}</h1>
            <div className={"MyEvents__menuBlock"}>
                {user && (
                    <NavLink to="/myEvents_applications">
                        <ButtonPink text="Мои заявки"/>
                    </NavLink>
                )}
                {user && (
                    <NavLink to="/myEvents_calendarEvents">
                        <ButtonPink text="Мои встречи"/>
                    </NavLink>
                )}
                {user && (
                    <NavLink to="/myEvents_instructions">
                        <ButtonPink text="Мои инструкции"/>
                    </NavLink>
                )}
            </div>
        </div>
    )
}


export default MyEvents