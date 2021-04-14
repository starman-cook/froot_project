import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Account from '../../components/Account/Account';
import { fetchApprove, fetchCancelApprove, fetchStopRepeatability, fetchTodaysPayments } from '../../store/actions/paymentAction';
import moment from 'moment'
import './RegistryForApprove.css'


const RegistryForApprove = () => {
    const todaysPayments = useSelector(state => state.payments.todaysPayments);
    const today = moment().format('YYYY-MM-DD') 

    let totalAsia = 0
    todaysPayments.filter((payment) => {
        if(payment.payer === "Froot_Middle_Asia"){
            totalAsia += Number(payment.sum)
        }
        return totalAsia
    });
    let totalBusiness = 0
    todaysPayments.filter((payment) => {
        if(payment.payer === "Froot_Бизнес"){
            totalBusiness += Number(payment.sum)
        }
        return totalBusiness
    });
    const registry = true
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTodaysPayments())
    },[dispatch]);

    const approveHandler = (id) => {
        dispatch(fetchApprove(id));
    };
    const cancelApproveHandler = (id) => {
        dispatch(fetchCancelApprove(id));
    };
    const stopRepeatabilityHandler = (id) => {
        dispatch(fetchStopRepeatability(id));
    };

    return (
        <div className="Registry">
            <h2 className="Registry__title">Платежи на сегодня: {today} </h2>
            <div className="Registry__total">
                <h3>Общая сумма платежей по компаниям:</h3>
                <div className="flex-space">
                    <span className="Registry__total-company">"Froot_Middle_Asia": <strong>{totalAsia}</strong> KZT</span>
                    <span className="Registry__total-company">"Froot_Бизнес": <strong>{totalBusiness}</strong> KZT</span>
                </div>
            </div>
            
            <div>
                <Account 
                    registry={registry} 
                    approve={approveHandler}
                    cancelApprove={cancelApproveHandler}
                    stopRepeatability={stopRepeatabilityHandler}
                    payments={todaysPayments}/>
            </div>
            
        </div>
        
    )
};

export default RegistryForApprove;