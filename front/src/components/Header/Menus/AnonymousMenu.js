import React from 'react'
import { Link } from 'react-router-dom'


const AnonymousMenu = () => {
    return (
        <>
        <button  className="Header__button">
            <Link to="/register" className="Header__button-link">Регистрация</Link>
        </button>
        <button className="Header__button">
            <Link to="/login" className="Header__button-link">Войти</Link>
        </button>            
        </>
    )
}

export default AnonymousMenu
