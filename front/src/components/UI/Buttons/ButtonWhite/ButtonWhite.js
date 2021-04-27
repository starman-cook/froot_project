import React from 'react'
import './ButtonWhite.css'

const ButtonWhite = ({text, type, onClickHandler}) => {
    return (
        <button className="ButtonWhite" type={type} onClick={onClickHandler}>{text}</button>
    )
}

export default ButtonWhite
