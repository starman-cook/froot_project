import React, {useEffect, useState} from 'react';
import './ContentManager.css';
import {useDispatch, useSelector} from "react-redux";
import {getAllContent, getContentByUser} from "../../store/actions/contentActions";
import ContentManagerItem from "./ContentManagerItem/ContentManagerItem";
import axiosApi from "../../axiosApi";
import WithLoader from '../../hoc/WithLoader/WithLoader'
import {fetchAllUsers} from "../../store/actions/usersActions";

const ContentManager=()=>{
    const dispatch = useDispatch()
    const content = useSelector(state => state.contentManagers.content)
    const count = useSelector(state => state.contentManagers.content.count)
    let pagesNumbers = Math.ceil(count / 10); // получать количество страниц для пагинации и кидать число в цикл, чтобы получить массив, нужен для отрисовки
    const user = useSelector(state => state.users.user)
    const [activePage, setActivePage] = useState(1)
    const allWorkers = useSelector(state => state.users.users)

    const getContentByName = (id) => {
        dispatch(getContentByUser(id, activePage))
    }
    const chooseWorker = (event) => {
        const value = JSON.parse(event.target.value)
        dispatch(getContentByUser(value._id, activePage))
    }
    let allPages;
    const choosePage = (event) => {
        setActivePage(parseInt(event.target.textContent));
        countPagination();
    }

    const countPagination = () => {
        // Отрисовка пагинации
        if (pagesNumbers) {
            if (pagesNumbers <= 8) {
                let arr = [];
                for (let i = 0; i < pagesNumbers; i++) {
                    arr[i] = i + 1;
                }
                allPages = arr.map(el => {
                    return (
                        <p key={el} onClick={el !== "..." ? (event) => {choosePage(event)} : null} className={`${el !== "..." ? "PaginationNumber" : "PaginationDots"} ${el === 1 ? "PaginationNumber--defaultActive" : null}`}>
                            {el}
                        </p>
                    )
                });
            } else {
                // сложная отрисовка пагинации относительно количества страниц, чтобы было видно начальные и последние страницы когда мы в центре, но количество элементов должно оставаться 8
                let arr = [];
                if (activePage < 5) {

                    for (let i = 0; i < 8; i++) {
                        // Когда кликнута страница меньше пятой, но страниц больше 8
                        if (i > 4) {
                            arr[i] = "...";
                            arr[i + 1] = pagesNumbers - 1;
                            arr[i + 2] = pagesNumbers;
                            break;
                        } else {
                            arr[i] = i + 1;
                        }
                    }
                    // Если активная страница равна 5
                } else if (activePage === 5) {
                    for (let i = 0; i < 8; i++) {
                        if (i === 0) {
                            arr[i] = "...";
                        }
                        else if (i < 5) {
                            arr[i] = i + 1;
                        } else {
                            arr[i] = activePage + 1;
                            arr[i + 1] = "...";
                            arr[i + 2] = pagesNumbers;
                            break;
                        }
                    }
                }
                // Если активная страница выше 5 но не выше чем максимум - 3
                else if (activePage > 5 && activePage <= pagesNumbers - 3) {
                    arr[0] = 1;
                    arr[1] = "...";
                    arr[2] = activePage - 2;
                    arr[3] = activePage - 1;
                    arr[4] = activePage;
                    arr[5] = activePage + 1;
                    arr[6] = "...";
                    arr[7] = pagesNumbers;
                }
                // Если активная страница выше чем максимум - 3
                else if (activePage > pagesNumbers - 3) {
                    arr[0] = 1;
                    arr[1] = 2
                    arr[2] = "...";
                    arr[3] = pagesNumbers - 4;
                    arr[4] = pagesNumbers - 3;
                    arr[5] = pagesNumbers - 2;
                    arr[6] = pagesNumbers - 1;
                    arr[7] = pagesNumbers;
                }
                allPages = arr.map((el, i) => {
                    return (
                        <p key={el + i} onClick={el !== "..." ? (event) => {choosePage(event)} : null} className={`${el !== "..." ? "PaginationNumber" : "PaginationDots"} ${el === activePage ? "PaginationNumber--defaultActive" : null}`}>
                            {el}
                        </p>
                    )
                });
            }
        }
    }
    countPagination()
    const colorActivePage = () => {
        const el = document.getElementsByClassName('PaginationNumber');
        for (let i = 0; i < el.length; i++) {
            el[i].style.fontSize = '14px';
            el[i].style.textDecoration = 'none';
            el[i].style.fontWeight = 'normal';
        }
        if (pagesNumbers <= 8) {
            el[activePage - 1].style.fontSize = '18px';
            el[activePage - 1].style.fontWeight = 'bold';
            el[activePage - 1].style.textDecoration = 'underline';
        } else {
            if (activePage < 4) {
                el[activePage - 1].style.fontSize = '18px';
                el[activePage - 1].style.fontWeight = 'bold';
                el[activePage - 1].style.textDecoration = 'underline';
            } else if (activePage === pagesNumbers) {
                el[6].style.fontSize = '18px';
                el[6].style.fontWeight = 'bold';
                el[6].style.textDecoration = 'underline';
            } else if (activePage > pagesNumbers - 3) {
                el[6 - (pagesNumbers - activePage)].style.fontSize = '18px';
                el[6 - (pagesNumbers - activePage)].style.fontWeight = 'bold';
                el[6 - (pagesNumbers - activePage)].style.textDecoration = 'underline';
            } else {
                el[3].style.fontSize = '18px';
                el[3].style.fontWeight = 'bold';
                el[3].style.textDecoration = 'underline';
            }
        }
    }

    const paginationRight = () => {
        if (activePage !== pagesNumbers) {
            setActivePage(activePage + 1);
        }
    };
    const paginationLeft = () => {
        if (activePage !== 1) {
            setActivePage(activePage - 1);
        }
    };

    useEffect(() => {
        const el = document.getElementsByClassName('PaginationNumber');
        if (el[0]) {
            colorActivePage();
        }
    }, [activePage]);

    useEffect(() => {
        if (user.role.includes("viewAllContentlinks")) {
            dispatch(getAllContent(activePage))
            dispatch(fetchAllUsers())
        } else if (user.role.includes("viewOwnContentlinks")) {
            dispatch(getContentByUser(user._id, activePage))
        }
    }, [])

    let allContents
    if (content.jobs) {
        allContents = content.jobs.reverse().map((el, i) => {
            return <ContentManagerItem
                key={i}
                number={content.jobs.length - i}
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
            <p>Загрузка...</p>
        )
    }
    let workersOptions;
    if (allWorkers) {
        workersOptions = allWorkers.map((el, i) => {
            return (<option key={i} value={JSON.stringify(el)}>{el.name} {el.surname} - {el.position}</option>)
        })
    }

    return(
        <>
            {Math.ceil(count / 10) > 1 ?
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
                    <select defaultValue={"Выберите участников"} onChange={(event) => {
                        chooseWorker(event)
                    }} required className='ContentManager__input'>
                        <option disabled>Выберите участников</option>
                        {workersOptions}
                    </select>
                    : null}
                <h1 className={"ContentManager__title"}>Froot.kz Screenshot Watcher</h1>
                <div className={"ContentManager__block"}>
                    {allContents}
                </div>
            </div>
        </>
    )
};
export default WithLoader(ContentManager, axiosApi);