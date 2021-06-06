import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo-white.svg";
import "./Header.css";
import AnonymousMenu from "./Menus/AnonymousMenu";
import UserMenu from "./Menus/UserMenu/UserMenu";

const Header = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = useState({ menuShow: false, accauntShow: false })
  const classNameOfAccaunt = state.accauntShow ? 'Header__menu Header__accaunt' : 'Header__menu--none';
  const classNameOfMenu = state.menuShow ? 'Header__menu' : 'Header__menu--none';

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const handleResize = e => {
    setWindowWidth(e.target.window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 1200) {
      setState({ menuShow: true, accauntShow: true });
    }
  }, [windowWidth])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuClick = () => {
    if (!state.menuShow) {
      setState(prevState => {
        return { ...prevState, menuShow: true }
      })
    }
    else {
      setState(prevState => {
        return { ...prevState, menuShow: false }
      })
    }
  };
  const accauntClick = () => {
    if (!state.accauntShow) {
      setState(prevState => {
        return { ...prevState, accauntShow: true }
      })
    }
    else {
      setState(prevState => {
        return { ...prevState, accauntShow: false }
      })
    }
  }
  return (
    <div className="Header">
      <NavLink to="/">
        <img src={logo} alt="logo" />
      </NavLink>
      <button className={windowWidth > 1200 ? 'Header__menu--none' : "UserMenu__btn Header__burger"} onClick={menuClick}>Menu</button>
      <menu className={classNameOfMenu}>
        {user && user.role.includes("viewAllPayments") && (
          <Fragment>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <span className="Header__link">Платежи</span>
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {user.role.includes("approvePayment") && (
                <MenuItem>
                  <NavLink className="Header__link" to="/approve-registry">
                    Платежи для подтверждения
                </NavLink>
                </MenuItem>
              )}

              {user.role.includes("viewAllPayments") && (
                <MenuItem>
                  <NavLink to="/" className="Header__link">
                    Все платежи
                </NavLink>
                </MenuItem>
              )}
              {user.role.includes("payPayment") && (
                <MenuItem>
                  <NavLink className="Header__link" to="/pay-registry">
                    Платежи для Оплаты
                </NavLink>
                </MenuItem>
              )}

              {user.role.includes("addPayment") && (
                <MenuItem>
                  <NavLink to="/new-payment" className="Header__link">
                    Добавить платеж
                </NavLink>
                </MenuItem>
              )}
            </Menu>
          </Fragment>
        )}

        {user && user.role.includes("viewUsers") && (
          <NavLink className="Header__link" to="/admin-panel">
            Админ панель
          </NavLink>
        )}
        {user && user.role.includes("bookMeetingRoom") && (
          <NavLink to="/meetings" className="Header__link">
            График встреч
          </NavLink>
        )}
        {user && user.role.includes("addContentlink") && (
          <NavLink to="/content-manager" className="Header__link">
            Счетчик ссылок
          </NavLink>
        )}
        {/* {user && user.role.includes("viewAllContentlinks") && (
          <NavLink to="/content-report" className="Header__link">
            Отчет по ссылкам
          </NavLink>
        )} */}
        {user && user.role.includes('viewAllNews') && (
          <NavLink to="/news" className="Header__link">
            Новости
          </NavLink>
        )}
        {user && user.role.includes("viewAllPayments") && (
            <NavLink to="/myEvents" className="Header__link">
              Мои события
            </NavLink>
        )}

      </menu>
      <button className={windowWidth > 1200 ? 'Header__menu--none' : "UserMenu__btn Header__burger"} onClick={accauntClick}>Профиль</button>
      <div className={classNameOfAccaunt}>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</div>
    </div>
  );
};

export default Header;
