import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { editUsersData, fetchUserByID } from '../../store/actions/usersActions';
import { push } from 'connected-react-router'
import { useParams } from 'react-router-dom';
import './AddRole.css'

const AddRole = () => {
    const { id } = useParams()
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

    const checkStatus = (name) => {
        const roleCopy = [...state.role];
        if ((name === 'payPayment' || name === 'cancelPayedPayment') && (roleCopy.includes('approvePayment') || roleCopy.includes('cancelApprovedPayment'))) {
            return true
        }
        if ((name === 'approvePayment' || name === 'cancelApprovedPayment') && (roleCopy.includes('payPayment') || roleCopy.includes('cancelPayedPayment'))) {
            return true
        }
        return false
    }
    const inputChangeHandler = event => {
        console.log(event.target);
        const role = event.target.value
        const roleCopy = [...state.role];

        if (roleCopy.includes(role)) {
            const index = roleCopy.indexOf(role);
            if (index > -1) {
                roleCopy.splice(index, 1);

            }
            setState(prevState => {
                return { ...prevState, role: roleCopy }
            });
        } else {
            roleCopy.push(role)

            setState(prevState => {
                return { ...prevState, role: roleCopy }
            });
        }
    };

    const submitFormHandler = event => {
        event.preventDefault();
        dispatch(editUsersData(id, state));
        dispatch(push('/admin-panel'))
    };
    const rolesForPayment = [
        { name: "addPayment", text: "Создавать платеж" },
        { name: "editPayment", text: "Редактировать платеж" },
        { name: "approvePayment", text: "Подтверждать платеж" },
        { name: "payPayment", text: "Оплачивать платеж" },
        { name: "postponePayment", text: "Переносить платеж на следующий день" },
        { name: "viewAllPayments", text: "Просматривать все платежи" },
        { name: "viewTodayPayments", text: "Просматривать реестр платежей на сегодня" },
        { name: "cancelApprovedPayment", text: "Отменить подтверждение платежа" },
        { name: "cancelPayedPayment", text: "Отменить оплату платежа" },
        { name: "deletePayment", text: "Удалить платеж" }
    ]
    const rolesForUser = [
        { name: "authorizeUser", text: "Определять права пользователя" },
        { name: "editUser", text: "Редактировать данные пользователя" },
        { name: "deleteUser", text: "Удалять пользователя" },
        { name: "viewUsers", text: "Просматривать всех пользователей" }
    ]
    const rolesForMeetingRoom = [
        { name: "bookMeetingRoom", text: "Резервировать переговорку" },
        { name: "editBookedMeetingRoom", text: "Редактировать резерв переговорки" },
        { name: "deleteBookedMeetingRoom", text: "Удалять резерв переговорки" },
        { name: "viewBookingsMeetingRoom", text: "Просматривать резервы переговорки" }
    ]
    const rolesForNews = [
        { name: "addNews", text: "Добавить новость" },
        { name: "viewAllNews", text: "Просмотреть все новости" },
        { name: "changeStatusNews", text: "Поменять статус новости" }
    ]
    const rolesForContentLinks = [
        { name: "addContentlink", text: "Создавать новые заявки" },
        { name: "viewOwnContentlinks", text: "Просматривать заявки за текущую дату (созданные этим пользователем)" },
        { name: "viewAllContentlinks", text: "Просматривать заявки всех контент менеджеров" }
    ]
    return (
        <div className="AddRole">
            <div>
                <h2>Добавить права пользователю:</h2>
                <p><b>Имя:</b> {state.name}</p>
                <p><b>Фамилия:</b> {state.surname}</p>
                <p><b>Отчество:</b> {state.patronymic}</p>
                <p><b>Позиция:</b> {state.position}</p>
                <p><b>Почта:</b> {state.workEmail}</p>
                <p><b>Телефон:</b> {state.phone}</p>
                <p><b>Имя в телеграме:</b> {state.telegramName}</p>
            </div>
            <form className="AddRole__form"
                onSubmit={submitFormHandler}
            >
                <div className="AddRole__roles flex-space">
                    <div className="AddRole__roles-col">
                        <h3>Права по отношению к платежам</h3>
                        {rolesForPayment.map((role, index) => (
                            <div key={role.name}>
                                <input type="checkbox" id={role.name} name="role" value={role.name}
                                    checked={state.role.includes(role.name)} disabled={checkStatus(role.name)} onChange={(e) => inputChangeHandler(e)} />
                                <label htmlFor={role.name}>{role.text}</label><br />
                            </div>
                        ))}
                        <h3>Права по отношению к новостям</h3>
                        {rolesForNews.map(role => (
                            <div key={role.name}>
                                <input type="checkbox" id={role.name} name="role" value={role.name}
                                    checked={state.role.includes(role.name) && true} onChange={inputChangeHandler} />
                                <label htmlFor={role.name}>{role.text}</label><br />
                            </div>
                        ))}
                    </div>
                    <div className="AddRole__roles-col">
                        <h3>Права по отношению к пользователям</h3>
                        {rolesForUser.map(role => (
                            <div key={role.name}>
                                <input type="checkbox" id={role.name} name="role" value={role.name}
                                    checked={state.role.includes(role.name) && true} onChange={inputChangeHandler} />
                                <label htmlFor={role.name}>{role.text}</label><br />
                            </div>
                        ))}
                        <h3>Права по отношению к переговорке</h3>
                        {rolesForMeetingRoom.map(role => (
                            <div key={role.name}>
                                <input type="checkbox" id={role.name} name="role" value={role.name}
                                    checked={state.role.includes(role.name) && true} onChange={inputChangeHandler} />
                                <label htmlFor={role.name}>{role.text}</label><br />
                            </div>
                        ))}
                        <h3>Права по отношению к контент менеджеру</h3>
                        {rolesForContentLinks.map(role => (
                            <div key={role.name}>
                                <input type="checkbox" id={role.name} name="role" value={role.name}
                                    checked={state.role.includes(role.name) && true} onChange={inputChangeHandler} />
                                <label htmlFor={role.name}>{role.text}</label><br />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <button className="AddRole__btn" type="submit">Сохранить</button>
                </div>
            </form>
        </div>
    )
}

export default AddRole
