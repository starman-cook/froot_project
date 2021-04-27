import React, { useEffect, useState } from 'react';
import FileInput from '../../components/UI/Forms/FileInput';
import moment from 'moment'
import Modal from '../../components/UI/Modal/Modal';
import './News.css'
import ButtonPink from '../../components/UI/Buttons/ButtonPink/ButtonPink';
import { useDispatch, useSelector } from 'react-redux';
import { createNewsItem, fetchChangeStatus, fetchNews } from '../../store/actions/newsAction';
import { apiURL } from '../../config';
import { download } from '../../functions';
import Dropdown from '../../components/UI/Dropdown/Dropdown';

const News = () => {
    const dispatch = useDispatch();
    const news = useSelector((state) => state.news.news);
    const user = useSelector(state => state.users.user);

    const [state, setState] = useState({
        file: ""
    })
    useEffect(() => {
        dispatch(fetchNews());
    }, [dispatch]);

    const fileChangeHandler = (e) => {
        const name = e.target.name;
        const file = e.target.files[0];
        setState((prevState) => ({
            ...prevState,
            [name]: file,
        }));
    };
    const submitFormHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        Object.keys(state).forEach((key) => {
            formData.append(key, state[key]);
        });
        await dispatch(createNewsItem(formData));
        await dispatch(fetchNews());
        closeModal()
    };

    // для изменения статуса
    const changeStatusHandler = (e, newsId) => {
        const status = e.target.innerHTML        
        dispatch(fetchChangeStatus(newsId, status));
        dispatch(fetchNews());
      };

    // для модалки: добавление новости
    const [showModal, setShowModal] = useState({
        show: false
    });
    const openModal = () => {
        setShowModal({ show: true });
    }
    const closeModal = () => {
        setShowModal({ show: false })
    }
    const today = moment().format('DD-MM-YYYY') 
    const modalBody = <>
        <h3>Добавьте карту ввода или вывода</h3>
        <form 
          onSubmit={submitFormHandler}
        >
            <div className="Modal__content">
                <FileInput
                    required
                    name="file"
                    label="File"
                    onChange={fileChangeHandler}
                    placeholder="Карта ввода / вывода"
                />
            </div>
            <ButtonPink text="Добавить" /> 
        </form>
        </>
    let statuses = ['Не сделано', 'В работе', 'Сделано']
    
    return (
        <>
            <div className="News flex-space">
                <h2 >Сегодня: {today} </h2>
                <ButtonPink text="Добавить" onClickHandler={openModal}/>   
            </div>                     
            {showModal.show && <Modal className="News__modal" 
                                    body={modalBody} 
                                    close={closeModal} />}    
            <table className="table">
                <thead>
                    <tr>
                        <th>№ новости</th>
                        <th>ID новости</th>
                        <th>Дата новости</th>
                        <th>Новость</th>
                        <th>Инициатор</th>
                        <th>Контент-менеджер</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody> 
                    {news && news.map((newsItem, index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{newsItem._id}</td>
                            <td>{newsItem.createDate}</td>
                            <td>{newsItem.file && <a onClick={()=> download(apiURL + "/uploads/" + newsItem.file, `file ${newsItem._id}.xlsx`)}>Скачать</a>}</td>
                            <td>
                                {newsItem.user && newsItem.user.surname + " " + newsItem.user.name}
                                </td>
                            <td>
                                {user && user.role.includes('viewAllNews') && user.surname + " " + user.name}
                                </td>
                            {user && user.role.includes('viewAllNews') && <td>
                                <Dropdown 
                                    dropdownTitle = {newsItem.status}
                                    dropdownContents = {statuses.filter(s => String(s) !== String(newsItem.status)) }
                                    changeContentHandler = {(e, )=>changeStatusHandler(e, newsItem._id)}/></td>}
                           
                        </tr>))}
                </tbody>  
            </table>                                     
        </>
    )    
};

export default News;