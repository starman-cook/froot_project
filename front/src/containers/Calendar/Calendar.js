import React, {useState, useEffect} from 'react';
import moment from 'moment';
import './Calendar.css';
import DayTiming from "../../components/DayTiming/DayTiming";
import axios from "axios";

const Calendar = () => {

    // передавать номер переговорки через query и добавлять его в запрос на получение данных именно этой переговорки
    // ВАЖНО при получении данных на месяц (не детальных, детальные по каждому дню при отрытии дня получаем),
    // нужно коэфициент загруженности показывать, чтобы пометить дату соответсвуюшим оттенком цвета
    const [room, setRoom] = useState("1");
    const [year, setYear] = useState(moment().year());
    const [month, setMonth] = useState(moment().month());
    const [day, setDay] = useState(moment().date());

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


    // Получаем данные с запроса, потом вынести эти функции в actions
    const [monthState, setMonthState] = useState({});

    const getBusyMonth = async (room, date) => {
        const response = await axios.get(`http://localhost:8000/calendarEvents/${room}/${date}/monthly`)
        await setMonthState(response.data)
    }

    //


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
        // await getBusyMonth(room, getDateForBusy())
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

    const rooms = ["1", "2", "room", "coming soon"];

    let allRooms = rooms.map((el, i) => {
        return (
            <h3 key={i} onClick={() => {
                pickTheRoom(i)
            }} className="ModalPeriod__room">{el}</h3>
        )
    });

    const pickTheYear = (i) => {
        setYear(years[i]);
        closeBg()
    }

    const pickTheRoom = (i) => {
        setRoom(rooms[i]);
        closeBg()
    }

    const openCurrentMonth = () => {
        setMonth(moment().month())
        setYear(moment().year())
    }

    useEffect(() => {
        getBusyMonth(room, getDateForBusy())
    }, [isModalRoom, isModalYear, isModalMonth, month, year, room])

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
                <div className="CalendarOne__header">

                    <div className="ModalPeriod__room-block">
                        <h3 onClick={toggleModalRoom} className="ModalPeriod__room">{room}</h3>
                        <div className="ModalPeriod__room-arrow" onClick={toggleModalRoom}/>
                        {isModalRoom ? <div className="ModalPeriod__room-modal">{allRooms}</div> : null}
                    </div>

                    <div className="ModalPeriod__year-block">
                        <h3 onClick={toggleModalYear} className="ModalPeriod__year">{year}</h3>
                        <div className="ModalPeriod__year-arrow" onClick={toggleModalYear}/>
                        {isModalYear ? <div className="ModalPeriod__year-modal">{allYears}</div> : null}
                    </div>
                    <div className="CalendarOne__month-block">
                        <p onClick={toggleModalMonth} className="CalendarOne__month">{months[month]}</p>
                        <div className="CalendarOne__arrow" onClick={toggleModalMonth}/>
                        {isModalMonth ? <div className={"CalendarOne__month-modal"}>{allMonths}</div> : null}
                    </div>
                </div>

                {tableHead}

                <div className="CalendarOne__table">
                    {tableBody.map((el, i) => {
                        const fullDate = getFullDateString(el, month, year)
                        let business = 0
                        if (monthState.busy) {
                            monthState.busy.map(a => {
                                if (a.date === fullDate) {
                                    return business = a.busy
                                }
                            })
                        }
                        if (el) {
                            return (<div style={business > 0 && business < 21 ? {
                                background: `rgb(${150 - business * 5} , ${255 - business * 5}, ${0})`,
                                borderRadius: "10px"
                            } : business >= 21 ? {background: `rgb(232, 100, 100)`, borderRadius: "10px"} : null}
                                         key={i}
                                         onClick={(event) => {
                                             pickTheDay(event)
                                         }} className="CalendarOne__column CalendarOne__column--active">{el}</div>)
                        } else {
                            return (<div key={i} className="CalendarOne__column">{el}</div>)
                        }
                    })}
                </div>
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