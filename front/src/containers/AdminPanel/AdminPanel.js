import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { deleteUser, fetchAllUsers } from '../../store/actions/usersActions';
import './AdminPanel.css';

const AdminPanel = () => {
    const users = useSelector(state => state.users.users);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const deleteUserById = id => {
        dispatch(deleteUser(id));
    }
    return (
        <Fragment>
            <h1>Сотрудники</h1>
            {users && users.map((user,index) => {
                return (
                    <div style={{borderBottom: '1px solid black'}} key={index}>
                    <p><b>Имя:</b> {user.name}</p>
                    <p><b>Фамилия:</b> {user.surname}</p>
                    <p><b>Отчество:</b> {user.patronymic}</p>
                    <p><b>Позиция:</b> {user.position}</p>
                    <p><b>Почта:</b> {user.workEmail}</p>
                    <p><b>Телефон:</b> {user.phone}</p>
                    <p><b>Имя в телеграме:</b> {user.telegramName}</p>
                    <p><b>Роль: </b>{user.role}</p>
                    <NavLink className='AdminPanel__navlink' to={'/users/'+user._id+'/edit'}>Редактировать</NavLink>
                    <button className='AdminPanel__navlink' onClick={()=>deleteUserById(user._id)}>Удалить</button>
                    </div>
                )
            })}
        </Fragment>
    )
};

export default AdminPanel;