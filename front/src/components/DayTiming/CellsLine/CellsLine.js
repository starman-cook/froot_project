import React from 'react';
import './CellsLine.css';


const cellsLine = (props) => {
    return (
        <div className="DayTiming__headCell--cellsLine">

            <div className="DayTiming__headCell">
                {props.timeContent}
            </div>
            <div className="DayTiming__cellBlock">
                <div
                    style={{background: `${props.bgColor}`}}
                    onClick={props.pickRange}
                    className="DayTiming__cell">
                    <span className="DayTiming__hiddenText">{props.timeContent}</span>
                </div>
            </div>
            <div className="DayTiming__cell--title">{props.title}</div>

            {props.isActiveTime ?
                <div className={props.isBottom ? 'DayTiming__modalInfo-bottom' : 'DayTiming__modalInfo'}>
                    <p className={"DayTiming__modalInfo__author"}><b>Создал встречу:</b> {props.creator}</p>
                    <p className={"DayTiming__modalInfo__subject"}><b>Тема встречи:</b> {props.titleInModal}</p>
                    <div className={"DayTiming__modalInfo__btnBlock"}>
                        {props.isOwner ? <button className={"DayTiming__modalInfo__btn"} onClick={props.deleteReserve}>Удалить</button> : null}
                        {props.hasFile ? <button className={"DayTiming__modalInfo__btn"} onClick={props.getFile}>Скачать файл</button> : null}
                    </div>
                    <p className={"DayTiming__modalInfo__details"}><b>Детали встречи:</b> {props.details}</p>
                    <div>
                        <p className={"DayTiming__modalInfo__participantsTitle"}>Участники встречи:</p>
                        {props.participants}
                    </div>
                </div> : null}

        </div>
    )
}

export default cellsLine;