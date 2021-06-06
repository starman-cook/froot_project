import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormElement from '../../components/UI/Forms/FormElement'
import icon from "../../assets/images/icon-close.png"
import './Register.css'
import { registerUser } from '../../store/actions/usersActions'
import { push } from 'connected-react-router'
import { NavLink } from 'react-router-dom'

const Register = () => {
    const dispatch = useDispatch()
    const [state, setstate] = useState({
        workEmail: '',
        surname: '',
        name: '',
        patronymic: '',
        position: '',
        telegramName: '@User',
        phone: '',
        password: ''
    })
    const error = useSelector(state => state.users.registerError)
    const getError = fieldName => {
        try{
          return error.errors[fieldName].message
        }catch(e){
          return undefined
        }
    }
    const inputChangeHandler = e => {
        const { name, value } = e.target
        setstate(prevState => {
            return { ...prevState, [name]: value }
        })
    }
    const submitFormHandler = async event => {
        event.preventDefault()
        await dispatch(registerUser({ ...state }))
    }
    const closeHandler = () => {
        dispatch(push('/'))
    }
    return (
        <div className="Register">
            <div className="flex-center">
                <h2 className="Register__title">Регистрация</h2>
                <div className="Register__close" onClick={closeHandler}>
                    <img className="icon" src={icon} />
                </div>
            </div>
            <form className="Register__form" onSubmit={submitFormHandler} >
                <FormElement
                    placeholder="Рабочий email"
                    label="Work email"
                    onChange={inputChangeHandler}
                    name="workEmail"
                    value={state.workEmail}
                    required
                    error={getError('workEmail')}
                />
                <FormElement
                    placeholder="Фамилия"
                    label="Surname"
                    onChange={inputChangeHandler}
                    name="surname"
                    value={state.surname}
                    required
                    error={getError('surname')}
                />
                <FormElement
                    placeholder="Имя"
                    label="Name"
                    onChange={inputChangeHandler}
                    name="name"
                    value={state.name}
                    required
                    error={getError('name')}
                />
                <FormElement
                    placeholder="Отчество"
                    label="Patronymic"
                    onChange={inputChangeHandler}
                    name="patronymic"
                    value={state.patronymic}
                />
                <FormElement
                    placeholder="Должность"
                    label="Position"
                    onChange={inputChangeHandler}
                    name="position"
                    value={state.position}
                    required
                    error={getError('position')}
                />
                <FormElement
                    placeholder="Телефон"
                    label="Phone"
                    onChange={inputChangeHandler}
                    name="phone"
                    value={state.phone}
                    required
                    error={getError('phone')}
                />
                <FormElement
                    placeholder="Пароль"
                    label="Password"
                    onChange={inputChangeHandler}
                    name="password"
                    type="password"
                    value={state.password}
                    required
                    error={getError('password')}
                />
                <div className="flex-center">
                    <button className="Register__btn" type="submit">Зарегистрировать</button>
                </div>
                <div className='flex-end'>У вас уже имеется акканут для входа? <NavLink className='Register__navlink' to='/login'>Войти</NavLink></div>
            </form>
        </div>
    )
}

export default Register
