import React, {useEffect, useRef} from 'react'
import './ContentManager.css'
import {shallowEqual, useDispatch, useSelector} from "react-redux"
import {getAllContent, getContentByUser, setActivePage, setLoader, setWorker} from "../../store/actions/contentActions"
import ContentManagerItem from "./ContentManagerItem/ContentManagerItem"
import {fetchAllUsers} from "../../store/actions/usersActions"

const ContentManager=()=>{
    /**
     * Создание всех необъодимых переменных
    **/
    const refSelect = useRef()
    const dispatch = useDispatch()
    const {content,  worker, loader, activePage} = useSelector(state => state.contentManagers, shallowEqual())
    const {user, users} = useSelector(state => state.users, shallowEqual())
    const pagesNumbers = Math.ceil(content.count / 10); // получать количество страниц для пагинации и кидать число в цикл, чтобы получить массив, нужен для отрисовки
    let allPages
    let allContents
    let workersOptions

    /**
     * Функция получения данных по определенному юзеру при клике на его имя внутри элементы
     **/
    const getContentByName = (id) => {
        dispatch(setActivePage(1))
        dispatch(setLoader(true))
        loadContent(1, id)
    }

    /**
     * Функция получения данных по определенному юзеру выборе из селекта
     **/
    const chooseWorker = (event) => {
        event.preventDefault()
        dispatch(setActivePage(1))
        dispatch(setLoader(true))
        const value = JSON.parse(event.target.value)
        dispatch(setWorker(value._id))
        loadContent(1, value._id)
    }

    /**
     * Выбор старницы по клику по номеру страницы
     **/
    const choosePage = (event) => {
        dispatch(setActivePage(parseInt(event.target.textContent)));
        loadContent(parseInt(event.target.textContent), worker)
        countPagination()
    }

    /**
     * Функция загрузки данных, определение загружать все или только по
     * определенному юзеру происходит внутри этой функции
     **/
    const loadContent = (pageNum, workerId) => {
        dispatch(setLoader(true))
        if (workerId) {
            dispatch(getContentByUser(workerId, pageNum))
        }
        else if (user.role.includes("viewAllContentlinks")) {
            dispatch(getAllContent(pageNum))
            dispatch(fetchAllUsers())
        }
        else if (user.role.includes("viewOwnContentlinks")) {
            dispatch(getContentByUser(user._id, pageNum))
        }
    }

    /**
     * При перезагрузке сбрасываем фильтр если был и переходим на первую страницу
     **/
    useEffect(() => {
        dispatch(setWorker(null))
        loadContent(1, null)
    }, [])

    /**
     * При владении прав просмотра всех данных есть кнопка для сброса фильров по имени
     * Показывает все данные какие есть, отсортированы по дате начала работы
     **/
    const showAllContent = () => {
        setWorker(null)
        refSelect.current.value = "Выберите участников"
        dispatch(setActivePage(1))
        dispatch(setLoader(true))
        dispatch(getAllContent(activePage))
    }

    /**
     * Жесткая функция, взял из другого проекта своего, это мой монстр Франкенштейна
     * Работает как надо, считает и отображает страницы, подствечивает активную страницу
     **/
    const countPagination = () => {
        // Отрисовка пагинации
        if (pagesNumbers) {
            if (pagesNumbers <= 8) {
                let arr = []
                for (let i = 0; i < pagesNumbers; i++) {
                    arr[i] = i + 1
                }
                allPages = arr.map(el => {
                    return (
                        <p key={el} onClick={el !== "..." ? (event) => {choosePage(event)} : null} className={`${el !== "..." ? "PaginationNumber" : "PaginationDots"} ${el === 1 ? "PaginationNumber--defaultActive" : null}`}>
                            {el}
                        </p>
                    )
                })
            } else {
                // сложная отрисовка пагинации относительно количества страниц, чтобы было видно начальные и последние страницы когда мы в центре, но количество элементов должно оставаться 8
                let arr = [];
                if (activePage < 5) {

                    for (let i = 0; i < 8; i++) {
                        // Когда кликнута страница меньше пятой, но страниц больше 8
                        if (i > 4) {
                            arr[i] = "..."
                            arr[i + 1] = pagesNumbers - 1;
                            arr[i + 2] = pagesNumbers;
                            break;
                        } else {
                            arr[i] = i + 1
                        }
                    }
                    // Если активная страница равна 5
                } else if (activePage === 5) {
                    for (let i = 0; i < 8; i++) {
                        if (i === 0) {
                            arr[i] = "..."
                        }
                        else if (i < 5) {
                            arr[i] = i + 1
                        } else {
                            arr[i] = activePage + 1
                            arr[i + 1] = "..."
                            arr[i + 2] = pagesNumbers;
                            break
                        }
                    }
                }
                // Если активная страница выше 5 но не выше чем максимум - 3
                else if (activePage > 5 && activePage <= pagesNumbers - 3) {
                    arr[0] = 1
                    arr[1] = "..."
                    arr[2] = activePage - 2
                    arr[3] = activePage - 1
                    arr[4] = activePage
                    arr[5] = activePage + 1
                    arr[6] = "..."
                    arr[7] = pagesNumbers;
                }
                // Если активная страница выше чем максимум - 3
                else if (activePage > pagesNumbers - 3) {
                    arr[0] = 1
                    arr[1] = 2
                    arr[2] = "..."
                    arr[3] = pagesNumbers - 4
                    arr[4] = pagesNumbers - 3
                    arr[5] = pagesNumbers - 2
                    arr[6] = pagesNumbers - 1
                    arr[7] = pagesNumbers
                }
                allPages = arr.map((el, i) => {
                    return (
                        <p key={el + i} onClick={el !== "..." ? (event) => {choosePage(event)} : null} className={`${el !== "..." ? "PaginationNumber" : "PaginationDots"} ${el === activePage ? "PaginationNumber--defaultActive" : null}`}>
                            {el}
                        </p>
                    )
                })
            }
        }
    }

    /**
     * Вызов функции отрисовки пагинации (номеров страниц), через useEffect почему то не работает
     **/
        countPagination()

    /**
     * Функция подкраски активной выбранной страницы пагинации
     **/
    const colorActivePage = () => {
        const el = document.getElementsByClassName('PaginationNumber')
        for (let i = 0; i < el.length; i++) {
            el[i].style.fontSize = '14px'
            el[i].style.textDecoration = 'none'
            el[i].style.fontWeight = 'normal'
        }
        if (pagesNumbers <= 8) {
            el[activePage - 1].style.fontSize = '18px'
            el[activePage - 1].style.fontWeight = 'bold'
            el[activePage - 1].style.textDecoration = 'underline'
        } else {
            if (activePage < 4) {
                el[activePage - 1].style.fontSize = '18px'
                el[activePage - 1].style.fontWeight = 'bold'
                el[activePage - 1].style.textDecoration = 'underline'
            } else if (activePage === pagesNumbers) {
                el[6].style.fontSize = '18px'
                el[6].style.fontWeight = 'bold'
                el[6].style.textDecoration = 'underline'
            } else if (activePage > pagesNumbers - 3) {
                el[6 - (pagesNumbers - activePage)].style.fontSize = '18px'
                el[6 - (pagesNumbers - activePage)].style.fontWeight = 'bold'
                el[6 - (pagesNumbers - activePage)].style.textDecoration = 'underline'
            } else {
                el[3].style.fontSize = '18px'
                el[3].style.fontWeight = 'bold'
                el[3].style.textDecoration = 'underline'
            }
        }
    }

    /**
     * Стрелка вправо чтобы перейти на страницу правее
     **/
    const paginationRight = async() => {
        if (activePage !== pagesNumbers) {
            dispatch(setActivePage(activePage + 1))
            loadContent(activePage + 1, worker)
        }
    }

    /**
     * Стрелка влево чтобы перейти на страницу левее
     **/
    const paginationLeft = async() => {
        if (activePage !== 1) {
            dispatch(setActivePage(activePage - 1))
            loadContent(activePage - 1, worker)
        }
    }

    /**
     * Отслеживание перемещения по страницам, чтобы подкрашивать активную страницу
     **/
    useEffect(() => {
        const el = document.getElementsByClassName('PaginationNumber');
        if (el[0]) {
            colorActivePage();
        }
    }, [activePage])

    /**
     * Отрисовка всех полученных данных
     **/
    if (content.jobs?.length) {
        allContents = content.jobs.map((el, i) => {
             return <ContentManagerItem
                key={i}
                number={content.count - (i + (activePage - 1) * 10)}
                userName={el.userName}
                startTime={el.startTime}
                stopTime={el.stopTime ? el.stopTime : null}
                startscreen={el.startScreen}
                stopscreen={el.stopScreen ? el.stopScreen: null}
                merchant={el.merchant}
                totalTime={el.totalTime ? el.totalTime : null}
                getByName={user.role.includes("viewAllContentlinks") ? () => getContentByName(el.user) : false}
            />
        })
    } else {
        allContents = (
            <p>Ничего не найдено</p>
        )
    }

    /**
     * Отрисовка всех option для select работников
     **/
    if (users) {
        workersOptions = users.map((el, i) => {
            return (<option key={i} value={JSON.stringify(el)}>{el.name} {el.surname} - {el.position}</option>)
        })
    }

    return(
        <>
            {Math.ceil(content.count / 10) > 1 ?
                <div className="LayoutSearchResults__paginationBlock">
                    <div onClick={paginationLeft} className="LayoutSearchResults__arrowBtn LayoutSearchResults__arrowBtn--left" />
                    <div onClick={paginationRight} className="LayoutSearchResults__arrowBtn LayoutSearchResults__arrowBtn--right" />
                    <div className="LayoutSearchResults__pagesNumbersBlock">
                        {allPages}
                    </div>
                </div>
                : null}
            <div className={"ContentManager"}>
                {user.role.includes("viewAllContentlinks") ?
                    <>
                        <select ref={refSelect} defaultValue={"Выберите участников"} onChange={(event) => {
                            chooseWorker(event)
                        }} required className='ContentManager__input'>
                            <option disabled>Выберите участников</option>
                            {workersOptions}
                        </select>
                        <p onClick={showAllContent} className='ContentManager__showAllBtn'>Показать всех</p>
                    </>
                    : null}
                <h1 className={"ContentManager__title"}>Froot.kz Screenshot Watcher</h1>
                <div className={"ContentManager__block"}>
                    {!!loader ? <div><div className={"Loader"} /></div> : allContents}
                </div>
            </div>
        </>
    )
};
export default ContentManager;