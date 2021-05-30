import React, {useState} from 'react'
import './ContentManagerItem.css'
import moment from 'moment'
import ContentImagesModal from "../ContentImagesModal/ContentImagesModal";

const ContentManagerItem = (props) => {

    const [isModal, setIsModal] = useState(false)
    const toggleModal = () => {
        setIsModal(!isModal)
    }

    return (
            <>
                {isModal ? <ContentImagesModal
                    close={toggleModal}
                    startScreen={props.startscreen}
                    stopScreen={props.stopscreen}
                    merchant={props.merchant}
                /> : null}
                <div className={"ContentManagerItem"}>
                    <p className={"ContentManagerItem__number"}>{props.number}</p>
                    <h3 onClick={props.getByName} className={props.getByName ? "ContentManagerItem__name ContentManagerItem__name--pointer" : "ContentManagerItem__name"}>{props.userName}</h3>
                    <div className={"ContentManagerItem__timeBlock"}>
                        {props.stopTime ? <p className={"ContentManagerItem__time"}>Начало: {props.startTime}</p> :<p className={"ContentManagerItem__time"}>{moment(props.startTime, "x").format("DD-MM-YYYY HH:mm:ss")}</p>}
                        {props.stopTime ? <p className={"ContentManagerItem__time"}>Конец: {props.stopTime}</p> : null}
                    </div>
                    <div onClick={toggleModal} className={"ContentManagerItem__imageBlock"}>
                        <img className={"ContentManagerItem__image"} src={props.startscreen} alt={props.merchant}/>
                        {props.stopscreen ? <img className={"ContentManagerItem__image"} src={props.stopscreen} alt={props.merchant}/> : null}
                    </div>
                    <h3 className={"ContentManagerItem__merchant"}>{props.merchant}</h3>
                    {props.totalTime ? <h2 className={"ContentManagerItem__totalTime"}>Времени затрачено: {props.totalTime}</h2> : <h2 className={"ContentManagerItem__totalTime"}>В процессе</h2>}
                </div>
            </>
    )
}


export default ContentManagerItem