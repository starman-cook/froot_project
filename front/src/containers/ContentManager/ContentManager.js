import React, {useEffect, useState} from 'react';
import './ContentManager.css';
import {useDispatch, useSelector} from "react-redux";
import {getAllContent, getContentByUser} from "../../store/actions/contentActions";
import ContentManagerItem from "./ContentManagerItem/ContentManagerItem";


const ContentManager=()=>{
    const dispatch = useDispatch()
    const content = useSelector(state => state.contentManagers.content)
    const getContentByName = (id) => {
        dispatch(getContentByUser(id))
    }
    useEffect(() => {
        dispatch(getAllContent())
    }, [])

    let allContents
    if (content.length) {
        allContents = content.reverse().map((el, i) => {
            return <ContentManagerItem
                key={i}
                userName={el.userName}
                startTime={el.startTime}
                stopTime={el.stopTime ? el.stopTime : null}
                startscreen={el.startScreen}
                stopscreen={el.stopScreen ? el.stopScreen: null}
                merchant={el.merchant}
                totalTime={el.totalTime ? el.totalTime : null}
                getByName={() => getContentByName(el.user)}
            />
        })
    } else {
        allContents = (
            <p>Загрузка...</p>
        )
    }

    return(
        <div className={"ContentManager"}>
            <h1 className={"ContentManager__title"}>Froot.kz Screenshot Watcher</h1>
            <div className={"ContentManager__block"}>
                {allContents}
            </div>
        </div>
    )
};
export default ContentManager;