import React, {useState, useEffect, useRef} from 'react'
import './DayTiming.css'
import axios from "axios";
import CellsLine from './CellsLine/CellsLine'
import {useDispatch, useSelector} from "react-redux";
import {fetchAllUsers} from "../../store/actions/usersActions";
import {getAllEvents} from "../../store/actions/calendarAction";
const DayTiming = (props) => {
    const timePeriods = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']

    const fileLoader = useRef();
    //TODO при открытие можадьного окна со временем
    // мы отправляем запрос с датой, и по этой дате получаем события на выбранный день
    // так же, мы получаем в календаре запросом загруженность на выбранный месяц, нужно продумать как бэк должен обработать и вернуть загруженность
    // это будут одного цвета клетки но с разными тонами, то есть все темнее и темнее от загруженности
    // а если все забито полностью, то становится красной например

    //TODO ВАЖНО в запросе должен передаваться номер переговорки, так как количество может быть любое

    //TODO ВАЖНО запросы может удалять инициатор и какой нибудь тип с офигенным допуском

    //TODO ВАЖНО добавить функцию загрузки файла для подготовки к презентации + функция удаления выбранного файла если загрузил случайно

    //TODO НУЖЕН Список сотрудников для поиска их в селекторе

    //TODO ВАЖНО добавить удаление резерва (права доступа удаления, выносить с апи, а здесь оно само исчезнет)

    //TODO Сохранять сотрудников в стэйт и делать проверку перед запросом если в базе есть сотрудники, чтобы по сто раз не отправлять запросы при кликам по разным датам

    //TODO Логирование добавить на апи, разбить по папкам, чтобы поиск был удобным

    //TODO форму с права поставить на десктопе

    //TODO при удалении информировать участников

    //TODO вносить изменения, и информировать участников

    /**
     * Здесь получем цвет
     * @returns {string}
     */
    const dispatch = useDispatch()
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
    const room = props.room // получать номер комнаты через выпадашку или еще какую штуку

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


    // Часть которую нужно будет вынести в actions , здесь я получаю список сотрудников (оставить в стэйте и не подгружать новых, добавить такую проверку), и загруженность на определенный день)
    // const [activeTimes, setActiveTimes] = useState([])
    const activeTimes = useSelector(state => state.calendarEvents.events)
    console.log(activeTimes)
    const allWorkers = useSelector(state => state.users.users)

    useEffect(() => {
        // getAllWorkers()
        dispatch(fetchAllUsers())
        // getEvents()
        dispatch(getAllEvents(room, fullDate))
    }, [])

    // const getEvents = async () => {
    //     const response = await axios.get(`http://localhost:8000/calendarEvents/${room}/${fullDate}/daily`)
    //     console.log(response.data)
    //     await setActiveTimes(response.data)
    // }
    //


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
                        if (!allCells[j].style.background) {
                            scaleCopy.push(allCells[j].textContent)
                            allCells[j].style.background = color
                            setChosenTime(`С ${firstClick.time} до ${parseMyTime(allCells[j].textContent)}`)
                        } else {
                            return
                        }
                    }
                }
                setScale(scaleCopy)
            } else {
                setScale([])
                for (let k = allCells.length - 1; k >= 0; k--) {
                    if (firstClick.index > k && k >= i) {
                        if (!allCells[k].style.background) {
                            scaleCopy.push(allCells[k].textContent)
                            allCells[k].style.background = color
                            setChosenTime(`С ${allCells[k].textContent} до ${parseMyTime(firstClick.time)}`)
                        } else {
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
        await axios.delete(`http://localhost:8000/calendarEvents/${id}`)
    }
    let timeTable;
    if (activeTimes) {
        timeTable = (
            <div>
                <h2>Расписание резервов на {month} {day}, {year}</h2>

                <div className="DayTiming__table-wrapper">
                    {timePeriods.map((el, i) => {
                        const index = activeTimes.findIndex(at => at.scale.includes(el))
                        // let uniqueIndex = -1;

                        let participants;
                        if (index > -1) {
                            // if (activeTimes[index]._id !== activeTimes[uniqueIndex]._id) {
                            //     uniqueIndex = index
                            // }
                            participants = activeTimes[index].participants.map((el, i) => {
                                return <p key={i}>{el.name}</p>
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
                            // getFile // ДОБАВИТЬ сюда функцию выгрузки файлов, имя файла в activeTimes[index].file
                            // editReserve
                            details={index > -1 ? activeTimes[index].description : ""}
                            participants={participants}
                            bgColor={index > -1 ? activeTimes[index].color : null}
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
        console.log(chosenWorkers)
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

    const submitEvent = async (event) => {
        event.preventDefault()
        const workersIds = chosenWorkers.map(el => {
            return el._id
        })
        let obj = {
            monthYear: monthYear,
            user: user._id,
            scale: scale,
            color: color,
            title: restOfState.title, // make function to get title
            description: restOfState.description, // make function to get description
            participants: workersIds,
            room: room,
            file: file,
            date: fullDate,
            from: secondClick ? firstClick.index < secondClick.index ? firstClick.time : secondClick.time : firstClick.time,
            to: secondClick ? firstClick.index > secondClick.index ? parseMyTime(firstClick.time) : parseMyTime(secondClick.time) : parseMyTime(firstClick.time)
        }

        console.log("OBJECT SUBMIT ********** ",obj)

        const formData = new FormData()
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                for (let i = 0; i < obj[key].length; i++) {
                    formData.append(key, obj[key][i])
                }
            } else {
                formData.append(key, obj[key])
            }
        })
        await axios.post('http://localhost:8000/calendarEvents', formData)
        props.closeModal()
    }

    return (
        <div className='DayTiming'>
            {timeTable}
            <div className='DayTiming__footer'>
                {chosenTime ? <p className='DayTiming__footer--text'>{chosenTime}</p> :
                    <div className='DayTiming__emptySpace'/>}
                <form onSubmit={(event) => {
                    submitEvent(event)
                }}>
                    <div className='DayTiming__footer--form'>
                        <p className='DayTiming__form--text'>Название</p>
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
                        <select defaultValue={"Выберите участников"} onChange={(event) => {
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