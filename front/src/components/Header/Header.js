import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo-white.svg";
import "./Header.css";
import AnonymousMenu from "./Menus/AnonymousMenu";
import UserMenu from "./Menus/UserMenu/UserMenu";

const Header = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="Header">
      <NavLink to="/">
        <img src={logo} alt="logo" />
      </NavLink>
      <menu>
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

            {user.role.includes("payPayment") && (
              <MenuItem>
                <NavLink className="Header__link" to="/pay-registry">
                  Платежи для оплаты
                </NavLink>
              </MenuItem>
            )}
            {console.log(user.role)}

            {user.role.includes("viewAllPayments") && (
              <MenuItem>
                <NavLink to="/" className="Header__link">
                  Все платежи
                </NavLink>
              </MenuItem>
            )}

            {user.role.includes("viewTodayPayments") &&
              !user.role.includes("payPayment") &&
              !user.role.includes("approvePayment") && (
                <MenuItem>
                  <NavLink className="Header__link" to="/registry">
                    Платежи на сегодня
                  </NavLink>{" "}
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
        {user && user.role.includes("viewAllContentlinks") && (
          <NavLink to="/content-report" className="Header__link">
            Отчет по ссылкам
          </NavLink>
        )}
        {user && user.role.includes('viewAllNews') && (
        <NavLink to="/news" className="Header__link">
          Новости
        </NavLink>
        )}
        
      </menu>
      <div>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</div>
    </div>
  );
};

export default Header;
