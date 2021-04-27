import React, { Fragment } from "react";
import Backdrop from "../Backdrop/Backdrop";
import "./Modal.css";

const Modal = ({ src, body, close}) => {
  return (
    <Fragment>
      <Backdrop close={close}/>
      <div className="Modal">
        <div className="Modal__container"> 
          <button onClick={close}>
            Close
          </button>
          {src? <img src={src}/> : body }
             
        </div>       
      </div>
    </Fragment>
  );
};

export default Modal;
