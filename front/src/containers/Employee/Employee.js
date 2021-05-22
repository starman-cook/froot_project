import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import FormElement from '../../components/UI/Forms/FormElement';
import { editUsersData, fetchUserByID } from '../../store/actions/usersActions';
import './Employee.css';

const Employee = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        name: "",
        surname: "",
        patronymic: "",
        position: "",
        role: "",
        telegramName: "",
        workEmail: "",
        phone: "",
    });
    useEffect(() => {
        dispatch(fetchUserByID(id)).then(stateData => {
            let stateCopy = {};
            Object.keys(state).forEach(key => {
                stateCopy[key] = stateData[key];
            });
            setState({ ...stateCopy });
        });
    }, [dispatch]);

    const inputChangeHandler = (event) => {
        const { name, value } = event.target;
        setState((prevState) => {
            return { ...prevState, [name]: value };
        });
    };
    const postData = (id) => {
        dispatch(editUsersData(id, state));
        dispatch(push('/admin-panel'))

    }

    return (
        <>
            <div>
                <FormElement
                    placeholder="Имя"
                    label="Имя"
                    onChange={inputChangeHandler}
                    name="name"
                    value={state.name}
                    required
                />
                <FormElement
                    placeholder="Фамилия"
                    label="Фамилия"
                    onChange={inputChangeHandler}
                    name="surname"
                    value={state.surname}
                    required
                />
                <FormElement
                    placeholder="Отчество"
                    label="Отчество"
                    onChange={inputChangeHandler}
                    name="patronymic"
                    value={state.patronymic}
                    required
                />
                <FormElement
                    placeholder="Позиция"
                    label="Позиция"
                    onChange={inputChangeHandler}
                    name="position"
                    value={state.position}
                    required
                />
                <FormElement
                    placeholder="Имя в телеграме"
                    label="Имя в телеграме"
                    onChange={inputChangeHandler}
                    name="telegramName"
                    value={state.telegramName}
                    required
                />
                <FormElement
                    placeholder="Почта"
                    label="Почта"
                    onChange={inputChangeHandler}
                    name="workEmail"
                    value={state.workEmail}
                    required
                />
                <FormElement
                    placeholder="Телефон"
                    label="Телефон"
                    onChange={inputChangeHandler}
                    name="phone"
                    value={state.phone}
                    required
                />
                <p>Роль</p>
                <select
                    className="FormElement"
                    name="role"
                    value={state.role}
                    required
                    onChange={inputChangeHandler}
                >
                    <option disabled value="Выберите роль">Выберите роль</option>
                    <option value="director">director</option>
                    <option value="accountant">accountant</option>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
                <button className='Employee__btn' onClick={() => postData(id)}>Сохранить</button>
            </div>
        </>
    )
};

export default Employee;