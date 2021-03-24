import React from "react";
import { useDispatch } from "react-redux";
import { createPayment } from "../../store/actions/paymentAction";
import icon from"../../assets/images/icon-close.png"
import {push} from 'connected-react-router'
import PaymentForm from "../../components/UI/Forms/PaymentForm/PaymentForm";
import './AddPayment.css';

const AddPayment = () => {
  const dispatch = useDispatch();
  const paymentFormSubmit = async paymentData => {
    await dispatch(createPayment(paymentData));
  };
  const closeHandler = () => {
    dispatch(push('/'))
  }
  return (
    <div className="AddPayment">
      <div className="flex-center">
        <h1 className="AddPayment__title">Создание заявки</h1>
          <div className="AddPayment__close" onClick={closeHandler}>
            <img className="icon" src={icon}/>
          </div>
      </div>      
      <PaymentForm
        onSubmit={paymentFormSubmit}/>
    </div>
  );
};

export default AddPayment;
