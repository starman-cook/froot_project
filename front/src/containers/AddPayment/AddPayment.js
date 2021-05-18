import React from "react";
import { useDispatch } from "react-redux";
import { createPayment } from "../../store/actions/paymentAction";
import {push} from 'connected-react-router'
import PaymentForm from "../../components/UI/Forms/PaymentForm/PaymentForm";
import './AddPayment.css';
import ButtonClose from "../../components/UI/Buttons/ButtonClose/ButtonClose";

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
        <ButtonClose onClickHandler={closeHandler}/>
      </div>      
      <PaymentForm
        onSubmit={paymentFormSubmit}/>
    </div>
  );
};

export default AddPayment;
