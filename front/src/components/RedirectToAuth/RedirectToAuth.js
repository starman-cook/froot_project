import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import './RedirectToAuth.css';

const RedirectToAuth = () => {
    return (
        <Fragment>
            <div className='Redirect'>
                <h1 className='Redirect__title'>Добро пожаловать во froot.kz</h1>
                <div className='Redirect__inside'>
                    <p className='Redirect__text'>Если у вас еще нет аккаунта, пройдите по странице</p>
                    <NavLink className='btn' to='/register'> Регистрация</NavLink>
                </div>
                <div className='Redirect__inside'>
                    <p> Если у вас уже имеется аккаунт </p>
                    <NavLink className='btn' to='/login'>Войти</NavLink>
                </div>
            </div>
        </Fragment>
    )
};

export default RedirectToAuth;