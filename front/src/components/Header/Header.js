import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo-white.svg";
import "./Header.css";
import AnonymousMenu from "./Menus/AnonymousMenu";
import UserMenu from "./Menus/UserMenu";

const Header = ({ user }) => {
  return (
    <div className="Header">
      <NavLink to="/">
        <img src={logo} alt="logo" />
      </NavLink>
      <menu>
      {user && user.role === 'admin' && <NavLink className="Header__link" to='/admin-panel'>Админ панель</NavLink>}
      {user && (user.role === 'director' || user.role === 'accountant') && <NavLink className="Header__link" to='/registry'>Реестр на сегодня</NavLink>}
        <NavLink to="/" className="Header__link">
          Платежи
        </NavLink>
        <NavLink to="/new-payment" className="Header__link">
          Добавить платеж
        </NavLink>
        <NavLink to="/meetings" className="Header__link">
          График встреч
        </NavLink>
        <NavLink to="/news" className="Header__link">
          Новости
        </NavLink>
      </menu>
      <div>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</div>
    </div>
  );
};

export default Header;
