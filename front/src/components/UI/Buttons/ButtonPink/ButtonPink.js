import React from 'react'
import './ButtonPink.css'

const ButtonPink = ({text, type, onClickHandler}) => {

    return (
        <button className="ButtonPink" type={type} onClick={onClickHandler}>{text} </button>
    )
}

export default ButtonPink
