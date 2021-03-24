import React, { useState } from "react";
import FileInput from "../FileInput";
import FormElement from "../FormElement";
import './PaymentForm.css';

const PaymentForm = ({onSubmit, paymentId}) => {
    const [state, setState] = useState({
        dateOfPayment: "",
        payer: "",
        purpose: "",
        invoice: "",
        comment: "",
        costCenter: "",
        contractor: "",
        termOfPayment: "",
        daysOfTermPayment: "",    
        priority: "Стандартный",
        image: "",
        sum: "",
        repeatability: false,
        periodicity: ""
    });
   
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
    const submitFormHandler = (event) => {
      event.preventDefault();
      const formData = new FormData();
      Object.keys(state).forEach((key) => {
        formData.append(key, state[key]);
      });
      onSubmit(formData);
    };  
     
    return (
        <div className="PaymentForm">
           <form className="PaymentForm__form"
                onSubmit={submitFormHandler} >
                <FormElement
                    placeholder="Дата платежа"
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
                    <option value="Выберите компанию-плательщика">Выберите компанию-плательщика</option>
                    <option value="Froot_Middle_Asia">Froot_Middle_Asia</option>
                    <option value="Froot_Бизнес">Froot_Бизнес</option>
                </select>
                </div>
                <FormElement
                    placeholder="Назначение"
                    label="Назначение *"
                    onChange={inputChangeHandler}
                    name="purpose"
                    value={state.purpose}
                    required
                />
                <FormElement
                    placeholder="Основание договора/счета"
                    label="Основание договора/счета *"
                    onChange={inputChangeHandler}
                    name="invoice"
                    value={state.invoice}
                    required
                />
                <FormElement
                    placeholder="Наименование контрагента"
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
                    <option value="Выберите условия платежа">Выберите условия платежа</option>
                    <option value="Отсрочка">Отсрочка</option>
                    <option value="Реализация">Реализация</option>
                    <option value="Предоплата">Предоплата</option>
                </select>
                </div>
                <FormElement
                    placeholder="Дни по условию платежа"
                    label="Дни по условию платежа"
                    onChange={inputChangeHandler}
                    name="daysOfTermPayment"
                    value={state.daysOfTermPayment}
                />
                <FormElement
                    placeholder="Кост центр"
                    label="Кост центр"
                    onChange={inputChangeHandler}
                    name="costCenter"
                    value={state.costCenter}
                />
                <FormElement
                    placeholder="Сумма платежа"
                    label="Сумма платежа *"
                    onChange={inputChangeHandler}
                    name="sum"
                    value={state.sum}
                    required
                />
                <textarea
                    className="PaymentForm__textarea"
                    placeholder="Комментарий"
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
                    <option value="Выберите приоритет">Выберите приоритет</option>
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
                <option value="Повторящийся платеж">Повторящийся платеж</option>
                <option value={false}>Нет</option>
                <option value={true}>Да</option>
                </select>
                </div>  
                <div className={state.repeatability? "" : "display-none"}>
                <span className="FormElement__label">Периодичность платежа</span>
                <select
                    className="FormElement"
                    name="periodicity"
                    value={state.periodicity}
                    required
                    onChange={inputChangeHandler}
                >
                <option value="Выбрать периодичность платежа">Выбрать периодичность платежа</option>
                <option value="monthly">Оплата раз в месяц</option>
                {/* <option value="Оплата 2 раза в месяц">Оплата 2 раза в месяц</option> */}
                <option value="weekly">Оплата раз в неделю</option>
                </select>
                </div>              
                <button className="PaymentForm__btn" type="submit">{paymentId?"Редактировать платеж" : "Добавить платеж"}</button>
            </form> 
        </div>
    );
}

export default PaymentForm
