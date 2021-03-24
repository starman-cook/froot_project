import React, { Fragment } from "react";
import Backdrop from "../Backdrop/Backdrop";
import "./Modal.css";

const Modal = ({show,src,close}) => {
  return (
    <Fragment>
        <Backdrop close={close}/>
      <div
        className="Modal"
      >
        <img src={src} />
        <button className="margin" onClick={close}>
          Close
        </button>
      </div>
    </Fragment>
  );
};

export default Modal;
