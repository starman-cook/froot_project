import React, {useEffect} from 'react'
import './MyEvents_CalendarEvents.css'
import {useDispatch, useSelector} from "react-redux";
import {getUserCalendarEvents} from "../../../store/actions/calendarAction";
import {apiURL} from "../../../config";
import axiosApi from "../../../axiosApi";
import moment from 'moment'

const MyEvents_CalendarEvents = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.users.user)
    const events = useSelector(state => state.calendarEvents.userEvents)
    useEffect(() => {
        dispatch(getUserCalendarEvents(user._id))
    }, [])
    let allEvents

    const accept = async (id) => {
        await axiosApi.get(`/calendarEvents/${id}/accept`)
        dispatch(getUserCalendarEvents(user._id))
    }
    const reject = async (id) => {
        await axiosApi.get(`/calendarEvents/${id}/reject`)
        dispatch(getUserCalendarEvents(user._id))
    }
    if (events) {
        allEvents = events.map((el, i) => {
            const date = moment(el.date, "DDMMYYYY")
            const thisUser = el.participants.filter(u => u.userId === user._id)
            return (
                <div key={i} className={"MyEvents_CalendarEvents__item"}>
                    <p className={"MyEvents_CalendarEvents__title"}>{el.title}</p>
                    <p className={"MyEvents_CalendarEvents__text"}><b>Дата встречи:</b> {date.format("DD-MM-YYYY")}</p>
                    <p className={"MyEvents_CalendarEvents__text"}><b>C:</b> {el.from}</p>
                    <p className={"MyEvents_CalendarEvents__text"}><b>По:</b> {el.to}</p>
                    <p className={"MyEvents_CalendarEvents__text"}><b>Описание:</b> {el.description}</p>
                    <p className={"MyEvents_CalendarEvents__text"}><b>Комната:</b> {el.room}</p>
                    {el.file !== "null" ? <a target={"blanc"} className={"MyEvents_CalendarEvents__link"} href={`${apiURL}/uploads/${el.file}`}>Файл</a> : null}
                    <div className={"MyEvents_CalendarEvents__participantsBlock"}>
                        <p className={"MyEvents_CalendarEvents__title"}>Участники встречи:</p>
                        {el.participants.map((el, i) => {
                            return (
                                <div key={i} className={"MyEvents_CalendarEvents__participantItem"}>
                                    <p>{el.name} {el.surname} - {el.position}</p>
                                    {el.accepted ? <p className={"MyEvents_CalendarEvents__text"}>Будет на встрече</p> : <p className={"MyEvents_CalendarEvents__text"}>Участие еще не подтвержденно</p>}
                                </div>
                            )
                        })}
                    </div>
                    {thisUser[0].accepted === null ? <div className={"MyEvents_CalendarEvents__btnBlock"}>
                        <div onClick={() => {accept(el._id)}} className={"MyEvents_CalendarEvents__btn"}>Подтвердить участие</div>
                        <div onClick={() => {reject(el._id)}} className={"MyEvents_CalendarEvents__btn"}>Отклонить участие</div>
                    </div> : thisUser[0].accepted ? <p className={"MyEvents_CalendarEvents__text"}>Вы подтвердили участие</p>
                    : <p className={"MyEvents_CalendarEvents__text"}>Вы отклонили данную встречу</p>}
                </div>
            )
        })
    } else {
        allEvents = <p>Предстоящих встреч у вас нет</p>
    }

    return (
        <div className={"MyEvents_CalendarEvents"}>
            {allEvents}
        </div>
    )
}


export default MyEvents_CalendarEvents