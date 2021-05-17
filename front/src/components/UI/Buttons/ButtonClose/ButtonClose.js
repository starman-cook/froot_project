import React from 'react'
import icon from '../../../../assets/images/icon-close.png'
import './ButtonClose.css'

const ButtonClose = ({onClickHandler}) => {
    return (
        <button className="ButtonClose" onClick={onClickHandler}>
            <img className="icon" src={icon}/>
        </button>
    )
}

export default ButtonClose
