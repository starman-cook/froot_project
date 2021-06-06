import React, {useEffect} from 'react'
import './MyEvents_Applications.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchSortedData} from "../../../store/actions/paymentAction";
import {apiURL} from "../../../config";


const MyEvents_Applications = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.users.user)
    const payments = useSelector(state => state.payments.payments)
    useEffect(() => {
        dispatch(fetchSortedData({user: user._id}))
    }, [])

    let allPayments

    const getNotApproved = () => {
        dispatch(fetchSortedData({user: user._id, approved: false}))
    }

    const getApprovedButNotPaided = () => {
        dispatch(fetchSortedData({user: user._id, approved: true, paided: false}))
    }
    const getPaided = () => {
        dispatch(fetchSortedData({user: user._id, paided: true}))
    }


    if (payments.length) {
        allPayments = payments.map((el,i) => {
            return (
                <div className={"MyEvents_Applications__item"} key={i}>
                    <div className={"MyEvents_Applications__textBlock"}>
                        <p className={"MyEvents_Applications__text"}><b>Статус:</b> {el.approved ? "подтверждён" : "еще не подтверждён"}</p>
                        <p className={"MyEvents_Applications__text"}><b>Дата платежа:</b> {el.dateOfPayment}</p>
                        <p className={"MyEvents_Applications__text"}><b>Компания плательщик:</b> {el.payer}</p>
                        <p className={"MyEvents_Applications__text"}><b>Назначение:</b> {el.purpose}</p>
                        <p className={"MyEvents_Applications__text"}><b>Основание договора/счёта:</b> {el.invoice}</p>
                        <p className={"MyEvents_Applications__text"}><b>Наименование контрагента:</b> {el.contractor}</p>
                        <p className={"MyEvents_Applications__text"}><b>Кост центр:</b> {el.costCenter}</p>
                        <p className={"MyEvents_Applications__text"}><b>Комментарий:</b> {el.comment}</p>
                        <p className={"MyEvents_Applications__text"}><b>Приоритет платежа:</b> {el.priority}</p>
                        <p className={"MyEvents_Applications__text"}><b>Сумма платежа:</b> {el.sum}</p>
                    </div>
                    <img className={"MyEvents_Applications__image"} src={`${apiURL}/uploads/${el.image}`} alt={el.invoice} />
                </div>
            )
        })
    } else {
        allPayments = (<p>Ничего не найдено</p>)
    }
    return (
        <div className={"MyEvents_Applications"}>
            <div className={"MyEvents_Applications__btnBlock"}>
                <p onClick={getApprovedButNotPaided} className={"MyEvents_Applications__btn"}>Подтвержденные</p>
                <p onClick={getNotApproved} className={"MyEvents_Applications__btn"}>Не подтвержденные</p>
                <p onClick={getPaided} className={"MyEvents_Applications__btn"}>Оплаченные</p>
            </div>
            {allPayments}
        </div>
    )
}


export default MyEvents_Applications