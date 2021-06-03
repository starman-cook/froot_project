import React, {useState, useEffect, useRef} from 'react'
import './DayTiming.css'
import CellsLine from './CellsLine/CellsLine'
import {useDispatch, useSelector} from "react-redux";
import {fetchAllUsers} from "../../store/actions/usersActions";
import {createCalendarEvent, deleteCalendarEvent, getAllEvents, getBusyMonth} from "../../store/actions/calendarAction";
import {download} from "../../functions";
import {apiURL} from "../../config";
const DayTiming = (props) => {
    const timePeriods = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']

    const fileLoader = useRef();

    /**
     * Здесь получем цвет
     * @returns {string}
     */
    const dispatch = useDispatch()
    const selectRef = useRef()
    const getRandomColor = () => {
        const r = []
        for (let i = 0; i < 3; i++) {
            r.push(Math.round(Math.random() * 155) + 100);
        }
        return `rgb(${r[0]}, ${r[1]}, ${r[2]})`
    }
    const user = useSelector(state => state.users.user)

    const day = props.day;
    const month = props.month;
    const monthNum = props.monthNum
    const year = props.year;
    const fullDate = props.fullDate
    const room = props.room 

    const getDateForBusy = () => {
        let monthCopy = monthNum + 1;
        if (monthCopy < 10) {
            monthCopy = "0" + monthCopy
        }
        return `${monthCopy}${year}`
    }
    const monthYear = getDateForBusy()

    const [firstClick, setFirstClick] = useState(null)
    const [secondClick, setSecondClick] = useState(null)
    const [color, setColor] = useState(getRandomColor())
    const loader = useSelector(state => state.calendarEvents.loader)

    const activeTimes = useSelector(state => state.calendarEvents.events)
    const allWorkers = useSelector(state => state.users.users)

    useEffect(() => {
        dispatch(fetchAllUsers())
        dispatch(getAllEvents(room, fullDate))
    }, [fullDate])

    const [chosenTime, setChosenTime] = useState("");

    const parseMyTime = (time) => {
        let arr = time.split(":");
        if (arr[1] === "30") {
            return `${parseInt(arr[0]) + 1}:00`
        } else {
            return `${arr[0]}:30`
        }
    }
    const [scale, setScale] = useState([])

    const pickTheRange = (event, i) => {
        const scaleCopy = [...scale]
        const allCells = document.getElementsByClassName("DayTiming__cell")
        if (!firstClick) {
            setScale([])
            setFirstClick({time: event.target.textContent, index: i})
            event.target.style.background = color
            scaleCopy.push(event.target.textContent)
            setScale(scaleCopy)
            setChosenTime(`С ${event.target.textContent} до ${parseMyTime(event.target.textContent)}`)
        } else if (!secondClick) {
            setScale([])
            setSecondClick({time: event.target.textContent, index: i})
            if (firstClick.index < i) {
                for (let j = 0; j < allCells.length; j++) {
                    if (j > firstClick.index && j <= i) {
                        if (allCells[j].style.background === "rgb(255, 255, 255)" || !allCells[j].style.background) {
                            scaleCopy.push(allCells[j].textContent)
                            allCells[j].style.background = color
                            setChosenTime(`С ${firstClick.time} до ${parseMyTime(allCells[j].textContent)}`)
                        } else {
                            setScale(scaleCopy)
                            return
                        }
                    }
                }
                setScale(scaleCopy)
            } else {
                setScale([])
                for (let k = allCells.length - 1; k >= 0; k--) {
                    if (firstClick.index > k && k >= i) {
                        if (allCells[k].style.background === "rgb(255, 255, 255)" || !allCells[k].style.background) {
                            scaleCopy.push(allCells[k].textContent)
                            allCells[k].style.background = color
                            setChosenTime(`С ${allCells[k].textContent} до ${parseMyTime(firstClick.time)}`)
                        } else {
                            setScale(scaleCopy)
                            return
                        }
                    }
                }
            }
            setScale(scaleCopy)
        } else {
            setChosenTime("");
            setFirstClick(null);
            setSecondClick(null);
            setScale([])
            for (let i = 0; i < allCells.length; i++) {
                if (allCells[i].style.background === color) {
                    allCells[i].style.background = ""
                }
            }
        }
    }
    const deleteReserve = async (id) => {
        await dispatch(deleteCalendarEvent(id))
        await dispatch(getAllEvents(room, fullDate))
    }

    let timeTable;
    if (activeTimes) {
        timeTable = (
            <div>
                <h2 className="DayTiming__table__title">Расписание резервов на {month} {day}, {year}</h2>

                <div className="DayTiming__table-wrapper">
                    {timePeriods.map((el, i) => {
                        const index = activeTimes.findIndex(at => at.scale.includes(el))
                        let isOwner;
                        let participants;
                        if (index > -1) {
                            isOwner = user._id === activeTimes[index].user._id
                            participants = activeTimes[index].participants.map((el, i) => {
                                return <div key={i} className={"DayTiming__modalInfo__participantsBlock"}>
                                        <p className={"DayTiming__modalInfo__participantsName"} key={i}>{el.name}</p>
                                    <p className={"DayTiming__modalInfo__participantsStatus"}>{el.accepted === null ? "Еще не подтвердил" : el.accepted ? "Подтвердил" : "Отклонил"}</p>
                                    </div>
                            })
                        }

                        return <CellsLine
                            key={i}
                            timeContent={el}
                            pickRange={(event) => {pickTheRange(event, i)}}

                            titleInModal={index > -1 ? activeTimes[index].title : ""}
                            title={index > -1 ? activeTimes[index].scale[0] === el  ? activeTimes[index].title : "" : ""}
                            isActiveTime={index > -1}
                            creator={index > -1 && activeTimes[index].user ? `${activeTimes[index].user.name} ${activeTimes[index].user.surname}` : ""}
                            deleteReserve={index > -1 ? () => {deleteReserve(activeTimes[index]._id)} : null}
                            hasFile={index > -1 && activeTimes[index].file !== "null"}
                            getFile={() => {download(`${apiURL}/uploads/${activeTimes[index].file}`, activeTimes[index].file)}}
                            details={index > -1 ? activeTimes[index].description : ""}
                            participants={participants}
                            bgColor={index > -1 ? activeTimes[index].color : "#fff"}
                            isBottom={i > 10}
                            isOwner={isOwner}
                        />
                    })
                    }
                </div>
            </div>
        )
    }

    let workersOptions;
    if (allWorkers) {
        workersOptions = allWorkers.map((el, i) => {
            return (<option key={i} value={JSON.stringify(el)}>{el.name} {el.surname} - {el.position}</option>)
        })
    }
    const [chosenWorkers, setChosenWorkers] = useState([])
    const pickAWorker = (event) => {
        const copyChosenWorkers = [...chosenWorkers]
        const worker = JSON.parse(event.target.value)
        if (copyChosenWorkers.findIndex(w => w._id === worker._id) >= 0) {
            console.log("Worker is already in the list")
            return
        }
        copyChosenWorkers.push(worker)
        setChosenWorkers(copyChosenWorkers)
    }
    const deleteWorker = (i) => {
        const copyChosenWorkers = [...chosenWorkers]
        copyChosenWorkers.splice(i, 1)
        setChosenWorkers(copyChosenWorkers)
        selectRef.current.value = null
    }
    let displayWorkers = chosenWorkers.map((el, i) => {
        return (
            <div key={i} className='DayTiming__workerName'>
                <p className='DayTiming__workerName--text'>{el.name} {el.surname} - {el.position}</p>
                <div onClick={() => {
                    deleteWorker(i)
                }} className='DayTiming__workerName--deleteIcon'/>
            </div>
        )
    })
    const [file, setFile] = useState(null);
    const getFile = (event) => {
        activateFileInput()
        setFile(event.target.files[0])
    }
    const activateFileInput = () => {
        fileLoader.current.click()
    }
    const deleteChosenFile = () => {
        setFile(null)
        fileLoader.current.value = null
    }
    const [restOfState, setRestOfState] = useState({})
    const inputRestOfState = (event) => {
        const {name, value} = event.target
        setRestOfState(prevState => {
            return {...prevState, [name]: value}
        })
    }
    
    // Создание резерва переговорки и отправка данных на сервер

    const submitEvent = async (event) => {
        event.preventDefault()
        let workersObjects = []
        chosenWorkers.forEach(el => {
            workersObjects.push({userId: el._id, name: el.name, surname: el.surname, position: el.position,  accepted: null})
        })
        let obj = {
            monthYear: monthYear,
            user: user._id,
            scale: scale,
            color: color,
            title: restOfState.title,
            description: restOfState.description,
            participants: JSON.stringify(workersObjects),
            room: room,
            file: file,
            date: fullDate,
            from: secondClick ? firstClick.index < secondClick.index ? firstClick.time : secondClick.time : firstClick.time,
            to: secondClick ? firstClick.index > secondClick.index ? parseMyTime(firstClick.time) : parseMyTime(secondClick.time) : parseMyTime(firstClick.time)
        }

        const formData = new FormData()
        Object.keys(obj).forEach(key => {
            if (key === 'file') {
                formData.append(key, obj[key])
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                for (let i = 0; i < obj[key].length; i++) {
                    formData.append(key, obj[key][i])
                }
            } else {
                formData.append(key, obj[key])
            }
        })
        await dispatch(createCalendarEvent(formData))
        await dispatch(getBusyMonth(room, monthYear))
        props.closeModal()
    }

    return (
        <div className='DayTiming'>
            {loader  ? <div className={"LoaderCalendar"} /> : timeTable}
            <div className='DayTiming__footer'>
                {chosenTime ? <p className='DayTiming__footer--text'>{chosenTime}</p> :
                    <div className='DayTiming__emptySpace'/>}
                <form onSubmit={(event) => {
                    submitEvent(event)
                }}>
                    <div className='DayTiming__footer--form'>
                        <p className='DayTiming__form--text'>Тема встречи</p>
                        <input onChange={(event) => {
                            inputRestOfState(event)
                        }} name="title" required className='DayTiming__footer--input' type="text"/>
                        <p className='DayTiming__form--text'>Описание встречи</p>
                        <textarea onChange={(event) => {
                            inputRestOfState(event)
                        }} name="description" required className='DayTiming__footer--input DayTiming__footer--textarea'
                                  type="text"/>
                        <p className='DayTiming__form--text'>Файл</p>
                        <div className='DayTiming__form--fileBlock'>
                            <input onChange={(event) => {
                                getFile(event)
                            }} name={"file"} className='DayTiming__form--hideInput' ref={fileLoader} type="file"/>
                            <div className='DayTiming__form--chooseFileBtn' onClick={activateFileInput}>Загрузить</div>
                            {file ?
                                <div className='DayTiming__form--fileBlock--toggled'>
                                    <p className='DayTiming__form--text DayTiming__form--text--shorten'>{file.name}</p>
                                    <div onClick={deleteChosenFile} className='DayTiming__workerName--deleteIcon'/>
                                </div>
                                : <div className='DayTiming__form--fileBlock--toggled'>
                                    <p className='DayTiming__form--text'>Файл не выбран</p>
                                </div>}

                        </div>
                        <p className='DayTiming__form--text'>Участники</p>
                        <select ref={selectRef} defaultValue={"Выберите участников"} onChange={(event) => {
                            pickAWorker(event)
                        }} required className='DayTiming__footer--input'>
                            <option disabled>Выберите участников</option>
                            {workersOptions}
                        </select>
                        {displayWorkers}
                    </div>
                    <div className='DayTiming__footer--bottom'>
                        <button
                            disabled={!scale.length > 0 || !Object.keys(restOfState).length > 0 || !chosenWorkers.length > 0}
                            className='DayTiming__btn'>Зарезервировать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DayTiming