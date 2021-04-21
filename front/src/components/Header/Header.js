import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo-white.svg";
import "./Header.css";
import AnonymousMenu from "./Menus/AnonymousMenu";
import UserMenu from "./Menus/UserMenu/UserMenu";

const Header = ({ user }) => {
  return (
    <div className="Header">
      <NavLink to="/">
        <img src={logo} alt="logo" />
      </NavLink>
      <menu>
        {user && user.role.includes('viewUsers') && <NavLink className="Header__link" to='/admin-panel'>
          Админ панель</NavLink>}
        {user && user.role.includes('approvePayment') && <NavLink className="Header__link" to='/approve-registry'>
          Платежи для подтверждения</NavLink>}
        {user && user.role.includes('payPayment') && <NavLink className="Header__link" to='/pay-registry'>
          Платежи для оплаты</NavLink>}
        {user && user.role.includes('viewAllPayments') && <NavLink to="/" className="Header__link">
          Все платежи</NavLink>}
        {user && user.role.includes('viewTodayPayments') && !user.role.includes('payPayment') && !user.role.includes('approvePayment') && <NavLink className="Header__link" to='/registry'>
          Платежи на сегодня</NavLink>}
        {user && user.role.includes('addPayment') && <NavLink to="/new-payment" className="Header__link">
          Добавить платеж</NavLink>}
        {user && user.role.includes('bookMeetingRoom') && <NavLink to="/meetings" className="Header__link">
          График встреч
        </NavLink>}
        {user && user.role.includes('addContentlink') && <NavLink to="/content-manager" className="Header__link">
          Счетчик ссылок
        </NavLink>}
        <NavLink to="/news" className="Header__link">
          Новости
        </NavLink>
      </menu>
      <div>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</div>
    </div>
  );
};

export default Header;
