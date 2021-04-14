import React from 'react'
import {logoutUser} from '../../../../store/actions/usersActions'
import { useDispatch } from 'react-redux'
import './UserMenu.css'

const UserMenu = ({user}) => {
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(logoutUser())
    }
    return (
        <div className="UserMenu flex-center">
            <h3 className="UserMenu__title">
                Добро пожаловать, {user.name}!
            </h3>
            <button className="UserMenu__btn" onClick={logout}>Выйти</button>
        </div>                        
    )
}

export default UserMenu
