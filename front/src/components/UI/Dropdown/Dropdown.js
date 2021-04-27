import React from 'react'
import './Dropdown.css'

const Dropdown = ({dropdownTitle, dropdownContents,changeContentHandler}) => {
    return (
        <div className="Dropdown">
        <span id="Dropdown" className="Dropdown__title">{dropdownTitle}</span>
        <div className="Dropdown__content">
            {dropdownContents && dropdownContents.map((dropdownContent,index) => (
                <div className="Dropdown__content-item" key={index} onClick={(e)=>changeContentHandler(e)}>{dropdownContent}</div>
            ))}
        </div>
    </div>
    )
}

export default Dropdown
