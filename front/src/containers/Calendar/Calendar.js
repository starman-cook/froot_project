import React, {useState, useEffect} from 'react';
import moment from 'moment';
import './Calendar.css';
import DayTiming from "../../components/DayTiming/DayTiming";
import {fetchAllUsers} from "../../store/actions/usersActions";
import {useDispatch, useSelector} from "react-redux";
import {addNewRoom, deleteRoom, getAllRooms, getBusyMonth} from "../../store/actions/calendarAction";
import { Fragment } from 'react';

const Calendar = () => {

    const dispatch = useDispatch()
    const rooms = useSelector(state => state.calendarEvents.rooms);

    const [room, setRoom] = useState("");
    const [year, setYear] = useState(moment().year());
    const [month, setMonth] = useState(moment().month());
    const [day, setDay] = useState(moment().date());
    const loader = useSelector(state => state.calendarEvents.loader)

    const user = useSelector(state => state.users.user)
    let canAddRoom
    if (user) {
        canAddRoom = user.role.includes('addNewMeetingRoom')
    }
    let canDeleteRoom
    if (user) {
        canDeleteRoom = user.role.includes('deleteMeetingRoom')
    }

    const monthState = useSelector(state => state.calendarEvents.busyMonth)

    const getDateForBusy = () => {
        let monthCopy = month + 1;
        if (monthCopy < 10) {
            monthCopy = "0" + monthCopy
        }
        return `${monthCopy}${year}`
    }
    
    const getFullDateString = (day, month, year) => {
        if (day < 10) {
            day = "0" + day
        }
        if (month + 1 < 10) {
            month = "0" + (month + 1)
        }
        return `${day}${month}${year}`
    }

    const [isModalMonth, setIsModalMonth] = useState(false);
    const [isModalRoom, setIsModalRoom] = useState(false);

    const toggleModalRoom = () => {
        setIsModalRoom(!isModalRoom)
        setIsModalYear(false);
        setIsBg(true)
        setIsModalMonth(false)
    }

    const toggleModalMonth = () => {
        setIsModalMonth(!isModalMonth);
        setIsBg(true)
        setIsModalYear(false)
        setIsModalRoom(false)
    }
    const [isBg, setIsBg] = useState(false);

    const closeBg = async () => {
        setIsBg(false);
        setIsModalYear(false)
        setIsModalMonth(false)
        setIsDayTiming(false)
        setIsModalRoom(false)
    }

    const [isDayTiming, setIsDayTiming] = useState(false);

    const openDayTiming = () => {
        setIsBg(true);
        setIsModalYear(false)
        setIsModalMonth(false)
        setIsDayTiming(true)
    }

    const [isModalYear, setIsModalYear] = useState(false);

    const toggleModalYear = () => {
        setIsModalYear(!isModalYear);
        setIsBg(true)
        setIsModalMonth(false)
        setIsModalRoom(false)
    }

    const tableHead = (
        <div className="CalendarOne__weekdays-block">
            <p className="CalendarOne__weekdays">Понедельник</p>
            <p className="CalendarOne__weekdays">Вторник</p>
            <p className="CalendarOne__weekdays">Среда</p>
            <p className="CalendarOne__weekdays">Четверг</p>
            <p className="CalendarOne__weekdays">Пятница</p>
            <p className="CalendarOne__weekdays">Суббота</p>
            <p className="CalendarOne__weekdays">Воскресенье</p>
        </div>
    )
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    let tableBody = [];
    let firstDayOfTheMonth = moment().set('year', year).set('month', month).startOf('month').weekday();
    const pickTheDay = (event) => {
        if (event.target.className === "CalendarOne__column CalendarOne__column--inactive") return
        setDay(event.target.textContent)
        openDayTiming()
    }
    let startDay = 1

    for (let i = 0; i < moment().daysInMonth() / 7 + 1; i++) {
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfTheMonth - 1) {
                tableBody.push(null);
            } else {
                if (moment().set('month', month).daysInMonth() >= startDay) {
                    tableBody.push(startDay);
                    startDay++;
                }
            }

        }
    }

    const pickTheMonth = (i) => {
        setMonth(i);
        closeBg()
    }

    let allMonths = months.map((el, i) => {
        return (<p key={i} onClick={() => {
            pickTheMonth(i)
        }} className={"CalendarOne__month"}>{el}</p>)
    });

    // получить возможные года
    const years = [moment().year(), moment().year() + 1, moment().year() + 2];

    let allYears = years.map((el, i) => {
        return (
            <h3 key={i} onClick={() => {
                pickTheYear(i)
            }} className="ModalPeriod__year">{el}</h3>
        )
    });

    const deleteRoomHandler = async (id) => {
        await dispatch(deleteRoom(id))
        await dispatch(getAllRooms())
        closeBg()
    }

    let allRooms = rooms.map((el, i) => {
        return (
            <div key={i} className="ModalPeriod__room--line">
                <h3 key={i} onClick={() => {
                    pickTheRoom(i)
                }} className="ModalPeriod__room">{el.room}</h3>
                {canDeleteRoom ? <> <div onClick={() => {
                    deleteRoomHandler(el._id)
                }} className='ModalPeriod__roomName--delete'/>
                <div  /> </> : null}
            </div>

        )
    });

    const pickTheYear = (i) => {
        setYear(years[i]);
        closeBg()
    }

    const pickTheRoom = (i) => {
        setRoom(rooms[i].room);
        closeBg()
    }

    const openCurrentMonth = () => {
        setMonth(moment().month())
        setYear(moment().year())
    }

    useEffect(() => {
        dispatch(getAllRooms())
        dispatch(fetchAllUsers())
        if (rooms.length) setRoom(rooms[0].room)
    }, [])
    
    useEffect(() => {
        room && dispatch(getBusyMonth(room, getDateForBusy()))
    }, [isBg, isModalRoom, isModalYear, isModalMonth, month, year, room])

    const [roomName, setRoomName] = useState('')

    const addNewRoomHandler = async () => {
        if (roomName.trim() !== '' && roomName) {
            await dispatch(addNewRoom({room: roomName}))
            setRoomName('')
            await dispatch(getAllRooms())
        }
    }
    const roomNameInput = (event) => {
        setRoomName(event.target.value)
    }

    const oneCalendar = (
        <>
            {isBg ? <div onClick={closeBg} className="CalendarOne__bg"/> : null}
            {isDayTiming ?
                <DayTiming
                    day={day}
                    month={months[month]}
                    year={year}
                    fullDate={getFullDateString(day, month, year)}
                    monthNum={month}
                    room={room}
                    closeModal={closeBg}
                />
                : null}
            <div className="CalendarOne">
                <h2 className="CalendarOne__today">Сегодня: {months[moment().month()]} {moment().date()}, {moment().year()}</h2>
                <button onClick={openCurrentMonth} className="CalendarOne__btn">Открыть текущий месяц</button>
                { canAddRoom ? <div className="CalendarOne__addRoomBlock">
                    <input placeholder="Имя новой комнаты" value={roomName} onChange={(event) => {roomNameInput(event)}} type="text" name="roomName" className="CalendarOne__roomNameInput" />
                    <button onClick={addNewRoomHandler} className="CalendarOne__btn" >Создать комнату</button>
                </div> : null}
                <div className="CalendarOne__header">

                    <div className="ModalPeriod__room-block">
                        <h3 onClick={toggleModalRoom} className="ModalPeriod__room">Комната: {room}</h3>
                        <div className="ModalPeriod__room-arrow" onClick={toggleModalRoom}/>
                        {isModalRoom ? <div className="ModalPeriod__room-modal">{allRooms}</div> : null}
                    </div>

                    <div className="ModalPeriod__year-block">
                        <h3 onClick={toggleModalYear} className="ModalPeriod__year">Год: {year}</h3>
                        <div className="ModalPeriod__year-arrow" onClick={toggleModalYear}/>
                        {isModalYear ? <div className="ModalPeriod__year-modal">{allYears}</div> : null}
                    </div>
                    <div className="CalendarOne__month-block">
                        <p onClick={toggleModalMonth} className="CalendarOne__month">Месяц: {months[month]}</p>
                        <div className="CalendarOne__arrow" onClick={toggleModalMonth}/>
                        {isModalMonth ? <div className={"CalendarOne__month-modal"}>{allMonths}</div> : null}
                    </div>
                </div>
                {room ? <Fragment>
                    {tableHead}

                    {loader && (!isModalMonth && !isModalRoom && !isModalYear && !isDayTiming) ? <div className={"LoaderCalendar"} /> : <div className="CalendarOne__table">
                    {tableBody.map((el, i) => {
                        const fullDate = getFullDateString(el, month, year)
                        let business = 0
                        if (monthState) {
                            monthState.busy.map(a => {
                                if (a.date === fullDate) {
                                    return business = a.busy
                                }
                            })
                        }
                        if (el) {
                            const today = moment()
                            const str = `${el}-${month + 1}-${year}`
                            const otherDate = moment(str, `DD-MM-YYYY`)
                            return (<div style={business < 11 && business > 0 ? {
                                background: `rgb(0, 255, 0)`,
                                borderRadius: "10px"
                            } : business >= 11 && business < 21 ? {
                                background: `rgb(255, 255, 0)`,
                                borderRadius: "10px"
                            } : business === 21 ? {
                                background: `rgb(255, 0, 0)`,
                                borderRadius: "10px"
                            } : null}
                                         key={i}
                                         onClick={(event) => {
                                             pickTheDay(event)
                                         }} className={today.valueOf()-1000 * 60 * 60 * 24 > otherDate.valueOf() ? "CalendarOne__column CalendarOne__column--inactive" : "CalendarOne__column CalendarOne__column--active"}>{el}</div>)
                        } else {

                            return (<div key={i} className="CalendarOne__column">{el}</div>)
                        }
                    })}
                </div>}
                </Fragment>: <h4>Выберите комнату</h4>}

            </div>
        </>
    );


    return (
        <div>
            {oneCalendar}
        </div>
    )
}

export default Calendar;