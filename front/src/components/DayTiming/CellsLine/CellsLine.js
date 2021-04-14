import React from 'react';
import './CellsLine.css';


const cellsLine = (props) => {
    return (
        <div className="DayTiming__headCell--cellsLine">

            <div className="DayTiming__headCell">
                {props.timeContent}
            </div>
            <div  className="DayTiming__cellBlock">
                <div
                     style={{background: `${props.bgColor}`}}
                     onClick={props.pickRange}
                     className="DayTiming__cell">
                    <span className="DayTiming__hiddenText">{props.timeContent}</span>
                </div>
            </div>
            <div className="DayTiming__cell--title">{props.title}</div>

            {props.isActiveTime ? <div className="DayTiming__modalInfo">
                <h3>{props.creator}</h3>
                <h3>{props.titleInModal}</h3>
                <button onClick={props.deleteReserve}>Удалить</button>
                <button onClick={props.getFile}>Скачать файл</button>
                {/*<button onClick={props.editReserve}>Редактировать резерв</button>*/}
                <p>{props.details}</p>
                <div>
                    {props.participants}
                </div>
            </div> : null}

        </div>
    )
}

export default cellsLine;