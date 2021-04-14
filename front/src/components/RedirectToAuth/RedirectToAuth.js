import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import './RedirectToAuth.css';

const RedirectToAuth = () => {
    return (
        <Fragment>
            <div className='Redirect'>
                <h1>Добро пожаловать во froot.kz</h1>
                <p>Если у вас еще нет аккаунта, пройдите по странице
                    <NavLink className='btn' to='/register'> Регистрация
                    
                    </NavLink></p><p> Если у вас уже имеется аккаунт <NavLink className='btn' to='/login'>Войти</NavLink></p>
            </div>
        </Fragment>
    )
};

export default RedirectToAuth;