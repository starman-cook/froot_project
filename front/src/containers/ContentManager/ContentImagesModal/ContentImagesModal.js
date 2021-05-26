import React from 'react'
import './ContentImagesModal.css'


const ContentImagesModal = (props) => {
    return (
        <>
            <div onClick={props.close} className={"ContentImagesModal__bg"} />
                <div onClick={props.close} className={"ContentImagesModal"}>
                        <img className={"ContentImagesModal__image"} src={props.startScreen} alt={props.merchant}/>
                        {props.stopScreen ? <img className={"ContentImagesModal__image"} src={props.stopScreen} alt={props.merchant}/> : null}
                </div>
            </>
    )
}

export default ContentImagesModal