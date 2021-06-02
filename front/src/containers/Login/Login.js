import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormElement from '../../components/UI/Forms/FormElement'
import icon from "../../assets/images/icon-close.png"
import './Login.css'
import { loginUser } from '../../store/actions/usersActions'
import { push } from 'connected-react-router'
import { NavLink } from 'react-router-dom'

const Login = () => {
    const dispatch = useDispatch()
    const [state, setstate] = useState({
        workEmail: '',
        password: ''
    })
    const error = useSelector(state => state.users.loginError)

    const inputChangeHandler = e => {
        const { name, value } = e.target
        setstate(prevState => {
            return { ...prevState, [name]: value }
        })
    }
    const submitFormHandler = async event => {
        event.preventDefault()
        await dispatch(loginUser(state))
    }
    const closeHandler = () => {
        dispatch(push('/'))
    }
    return (
        <div className="Login">
            <div className="flex-center">
                <h2 className="Login__title">Авторизация</h2>
                <div className="Login__close" onClick={closeHandler}>
                    <img className="icon" src={icon} />
                </div>
            </div>
            {error && <span className="FormElement__error_message" >{error.error}</span>}
            <form className="Login__form" onSubmit={submitFormHandler} >
                <FormElement
                    placeholder="Рабочий email"
                    label="Work email"
                    onChange={inputChangeHandler}
                    name="workEmail"
                    value={state.workEmail}
                    required
                />
                <FormElement
                    placeholder="Пароль"
                    label="Password"
                    onChange={inputChangeHandler}
                    name="password"
                    value={state.password}
                    required
                    type="password"
                />
                <div className="flex-center">
                    <button className="Login__btn" type="submit" id="login">Войти</button>
                </div>
                <div className='flex-end'>У вас еще нет аккаунта? <NavLink className='Login__navlink' to='/register'>Регистрация</NavLink></div>
            </form>
        </div>
    )
}

export default Login
