import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { deleteUser, fetchAllUsers } from '../../store/actions/usersActions';
import './AdminPanel.css';

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

import AdminForm from '../../components/UI/Forms/AdminForm/AdminForm';



const AdminPanel = () => {
    const users = useSelector(state => state.users.users);

    const filterItems = {
        "Все без фильтра": "all",
        "Почта": "workEmail",
        "Имя": "name",
        "Фамилия": "surname",
        "Отчество": "patronymic",
        "Позиция": "position",
        "Телефон": "phone",
        "Имя в телеграме": "telegramName",
    };

    const [filter, setFilter] = useState(Object.keys(filterItems)[0]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    }

    const [value, setValue] = useState({
        workEmail: "",
        name: "",
        surname: "",
        patronymic: "",
        position: "",
        phone: "",
        telegramName: ""
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const deleteUserById = id => {
        dispatch(deleteUser(id));
    }

    const setNewValue = newValue => {
        if (newValue) return setValue(newValue);
        setValue({});
    }

    return (
        <Fragment>
            <h1>Сотрудники</h1>
            {users &&
                <FormControl variant="outlined" >
                    <div className='tac'>
                    <InputLabel id="demo-mutiple-name-label">Фильтр</InputLabel>
                    <Select
                        labelId="demo-mutiple-name-label"
                        id="demo-mutiple-name"
                        value={filter}
                        onChange={handleFilterChange}
                        input={<Input />}
                    >
                        {Object.keys(filterItems).map((name) => (
                            <MenuItem key={name} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                    </div>
                    <hr></hr>
                    {filterItems[filter] !== 'all' ?
                        (<div>
                            <AdminForm
                                id={filterItems[filter]}
                                value={value ? value[filterItems[filter]] : ''}
                                onValueChange={
                                    (newValue) => setNewValue(newValue)
                                }
                                options={users}
                            />
                            { <div style={{ borderBottom: '1px solid black' }}>
                                <p><b>Имя:</b> {value.name}</p>
                                <p><b>Фамилия:</b> {value.surname}</p>
                                <p><b>Отчество:</b> {value.patronymic}</p>
                                <p><b>Позиция:</b> {value.position}</p>
                                <p><b>Почта:</b> {value.workEmail}</p>
                                <p><b>Телефон:</b> {value.phone}</p>
                                <p><b>Имя в телеграме:</b> {value.telegramName}</p>
                                <NavLink className='AdminPanel__navlink' to={'/users/' + value._id + '/edit'}>Редактировать</NavLink>
                                <NavLink className='AdminPanel__navlink' to={'/users/' + value._id + '/role'}>Редактировать права</NavLink>
                                <button className='AdminPanel__navlink' onClick={() => deleteUserById(value._id)}>Удалить</button>
                            </div>}
                        </div>) :
                        (<div className='flexs'>{users.map((user, index) => {
                            return (
                                <div className='border' style={{ borderBottom: '1px solid black' }} key={index}>
                                    <p><b>Имя:</b> {user.name}</p>
                                    <p><b>Фамилия:</b> {user.surname}</p>
                                    <p><b>Отчество:</b> {user.patronymic}</p>
                                    <p><b>Позиция:</b> {user.position}</p>
                                    <p><b>Почта:</b> {user.workEmail}</p>
                                    <p><b>Телефон:</b> {user.phone}</p>
                                    <p><b>Имя в телеграме:</b> {user.telegramName}</p>
                                    <NavLink className='AdminPanel__navlink' to={'/users/' + user._id + '/edit'}>Редактировать</NavLink>
                                    <NavLink className='AdminPanel__navlink' to={'/users/' + user._id + '/role'}>Редактировать права</NavLink>
                                    <button className='AdminPanel__navlink' onClick={() => deleteUserById(user._id)}>Удалить</button>
                                </div>
                            )
                        })}</div>)
                    }

                </FormControl>
            }
        </Fragment >
    )
};

export default AdminPanel;