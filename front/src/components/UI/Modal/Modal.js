import React, { Fragment } from "react";
import Backdrop from "../Backdrop/Backdrop";
import ButtonClose from "../Buttons/ButtonClose/ButtonClose"
import "./Modal.css";

const Modal = ({ src, body, name, close }) => {
  return (
    <Fragment>
      {!body && <Backdrop close={close} />}
      <div className={name === 'filter' ? "Modal filter" : "Modal"}>
        <div className="Modal__container">
          {src ? <img className="Modal__img" src={src} /> : body}
          <ButtonClose onClickHandler={close} />
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;
