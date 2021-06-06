import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPayment, fetchPaymentById } from "../../store/actions/paymentAction";
import icon from"../../assets/images/icon-close.png"
import {push} from 'connected-react-router'
import './EditPayment.css';
import { useParams } from "react-router-dom";
import FormElement from "../../components/UI/Forms/FormElement";
import FileInput from "../../components/UI/Forms/FileInput";

const EditPayment = () => {
    const {id} = useParams()
    const payment = useSelector((state) => state.payments.paymentById);
    const [state, setState] = useState({
        dateOfPayment: payment.dateOfPayment,
        payer: payment.payer,
        purpose: payment.purpose,
        invoice: payment.invoice,
        comment: payment.comment? payment.comment : "",
        costCenter: payment.costCenter? payment.costCenter : "",
        contractor: payment.contractor,
        termOfPayment: payment.termOfPayment? payment.termOfPayment : "",
        daysOfTermPayment: payment.daysOfTermPayment? payment.daysOfTermPayment : "",    
        priority: payment.priority,
        image: payment.image,
        sum: payment.sum,
        repeatability: payment.repeatability? payment.repeatability : false,
        periodicity: payment.periodicity? payment.periodicity : ""
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPaymentById(id))
    }, [dispatch]);
   
    const inputChangeHandler = (event) => {
        const { name, value } = event.target;
        setState((prevState) => {
          return { ...prevState, [name]: value };
        });
    };
    const fileChangeHandler = (e) => {
      const name = e.target.name;
      const file = e.target.files[0];
      setState((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    };
    const submitFormHandler = async event => {
      event.preventDefault();
      const formData = new FormData();
      Object.keys(state).forEach((key) => {
        formData.append(key, state[key]);
      });
      await dispatch(editPayment(id, formData))
    };  
    const closeHandler = () => {
        dispatch(push('/'))
    }
  return (
    <div className="EditPayment">
      <div className="flex-center">
        <h1 className="EditPayment__title">Редактирование заявки</h1>
          <div className="EditPayment__close" onClick={closeHandler}>
            <img className="icon" src={icon}/>
          </div>
      </div>      
      <div className="PaymentForm">
           <form className="PaymentForm__form"
                onSubmit={submitFormHandler} >
                <FormElement
                    type='date'
                    label="Дата платежа *"
                    onChange={inputChangeHandler}
                    name="dateOfPayment"
                    value={state.dateOfPayment}
                    required
                />
                <div>
                <span className="FormElement__label">Компания-плательщик *</span>
                <select
                    className="FormElement"
                    name="payer"
                    value={state.payer}
                    required
                    onChange={inputChangeHandler}
                >
                    <option disabled value="Выберите компанию-плательщика">Выберите компанию-плательщика</option>
                    <option value="Froot_Middle_Asia">Froot_Middle_Asia</option>
                    <option value="Froot_Бизнес">Froot_Бизнес</option>
                </select>
                </div>
                <FormElement
                    label="Назначение *"
                    onChange={inputChangeHandler}
                    name="purpose"
                    value={state.purpose}
                    required
                />
                <FormElement
                    label="Основание договора/счета *"
                    onChange={inputChangeHandler}
                    name="invoice"
                    value={state.invoice}
                    required
                />
                <FormElement
                    label="Наименование контрагента *"
                    onChange={inputChangeHandler}
                    name="contractor"
                    value={state.contractor}
                    required
                />
                <div>
                <span className="FormElement__label">Условия платежа</span>
                <select
                    className="FormElement"
                    name="termOfPayment"
                    value={state.termOfPayment}
                    required
                    onChange={inputChangeHandler}
                >
                    <option disabled value="Выберите условия платежа">Выберите условия платежа</option>
                    <option value="Отсрочка">Отсрочка</option>
                    <option value="Реализация">Реализация</option>
                    <option value="Предоплата">Предоплата</option>
                </select>
                </div>
                <FormElement
                    label="Дни по условию платежа"
                    onChange={inputChangeHandler}
                    name="daysOfTermPayment"
                    value={state.daysOfTermPayment}
                />
                <FormElement
                    label="Кост центр"
                    onChange={inputChangeHandler}
                    name="costCenter"
                    value={state.costCenter}
                />
                <FormElement
                    label="Сумма платежа *"
                    onChange={inputChangeHandler}
                    name="sum"
                    value={state.sum}
                    required
                />
                <textarea
                    className="PaymentForm__textarea"
                    label="Комментарий"
                    onChange={inputChangeHandler}
                    name="comment"
                    value={state.comment}
                />
                <div>
                <span className="FormElement__label">Приоритет платежа *</span>
                <select
                    className="FormElement"
                    name="priority"
                    value={state.priority}
                    required
                    onChange={inputChangeHandler}
                >
                    <option disabled value="Выберите приоритет">Выберите приоритет</option>
                    <option value="Стандартный">стандартный</option>
                    <option value="Важный">важный</option>
                    <option value="Срочный">срочный</option>
                    <option value="Важный/срочный">важный/срочный</option>
                </select>
                </div>
                <div>
                <FileInput
                    required
                    name="image"
                    label="Image"
                    onChange={fileChangeHandler}
                />
                </div>
                <div>
                <span className="FormElement__label">Повторящийся платеж</span>
                <select
                    className="FormElement"
                    name="repeatability"
                    value={state.repeatability}
                    required
                    onChange={inputChangeHandler}
                >
                <option disabled value="Повторящийся платеж">Повторящийся платеж</option>
                <option value={false}>Нет</option>
                <option value={true}>Да</option>
                </select>
                </div>  
                <div className={state.repeatibility? "" : "display-none"}>
                <span className="FormElement__label">Периодичность платежа</span>
                <select
                    className="FormElement"
                    name="periodicity"
                    value={state.periodicity}
                    required
                    onChange={inputChangeHandler}
                >
                <option disabled value="Выбрать периодичность платежа">Выбрать периодичность платежа</option>
                <option value="Оплата раз в месяц">Оплата раз в месяц</option>
                <option value="Оплата 2 раза в месяц">Оплата 2 раза в месяц</option>
                <option value="Оплата раз в неделю">Оплата раз в неделю</option>
                </select>
                </div>              
                <button className="PaymentForm__btn" type="submit">Редактировать</button>
            </form> 
        </div>
    </div>
  );
};

export default EditPayment;
