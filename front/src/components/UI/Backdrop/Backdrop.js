import React from 'react'
import "./Backdrop.css"
const Backdrop = ({close})=>{

    return (
        <div className="Backdrop" onClick={close}></div>
    )
}
export default Backdrop