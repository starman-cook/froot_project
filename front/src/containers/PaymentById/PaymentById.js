import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { apiURL } from '../../config'
import { fetchPaymentById } from '../../store/actions/paymentAction'
import ButtonPink from "../../components/UI/Buttons/ButtonPink/ButtonPink"
import './PaymentById.css'

const PaymentById = () => {
    const {id} = useParams()
    const payment = useSelector((state) => state.payments.paymentById)
    let periodicity = ""
    if(payment.periodicity === "monthly"){
        periodicity = "Оплата раз в неделю"
    } else if (payment.periodicity === "weekly"){
        periodicity = "Оплата раз в неделю"
    } else periodicity = "-"

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPaymentById(id));
    }, [dispatch]);
    return (
        <div className="PaymentById">
            <div className="PaymentById__header">
                <h2 className="PaymentById__title">Платеж ID: {id}</h2>
                <NavLink to={`/payments/${id}/edit`}>
                    <ButtonPink text="Редактировать"/>
                </NavLink>
            </div>
            <div className="PaymentById__content">
                <div>
                    <p><b>Дата платежа:</b> {payment.dateOfPayment}</p>
                    <p><b>Компания-плательщик:</b> {payment.payer}</p>
                    <p><b>Назначение:</b> {payment.purpose}</p>
                    <p><b>Основание договора/счета :</b> {payment.invoice}</p>
                    <p><b>Наименование контрагента:</b> {payment.contractor}</p>
                    <p><b>Условия платежа:</b> {payment.termOfPayment? payment.termOfPayment: "-"}</p>
                    <p><b>Дни по условию платежа:</b> {payment.daysOfTermPayment? payment.daysOfTermPayment: "-"}</p>
                    <p><b>Кост центр:</b> {payment.costCenter? payment.costCenter: "-"}</p>
                    <p><b>Сумма платежа:</b> {payment.sum}</p>
                    <p><b>Комментарий:</b> {payment.comment? payment.comment: "-"}</p>
                    <p><b>Приоритет платежа: </b>{payment.priority}</p>   
                    <p><b>Повторящийся платеж:</b> {payment.repeatability? "да": "нет"}</p>
                    <p><b>Периодичность платежа:</b> {periodicity}</p>   
                </div>
                <div className="flex-column">
                    <h4>Счет:</h4> 
                        {payment.image? <img className={"PaymentById__image"} src={apiURL + "/uploads/" + payment.image} alt={payment.image}/>: <p>Счет отсутствует</p>}
                    
                </div>
            </div>
              
        </div>
    )
}

export default PaymentById
