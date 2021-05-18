import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Account from '../../components/Account/Account';
import { fetchApprove, fetchCancelApprove, fetchStopRepeatability, fetchTodaysPayments } from '../../store/actions/paymentAction';
import moment from 'moment'
import './RegistryForApprove.css'
import Total from '../../components/Total/Total';


const RegistryForApprove = () => {
    const todaysPayments = useSelector(state => state.payments.todaysPayments);
    const today = moment().format('YYYY-MM-DD') 

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
            <div className="Registry__content">
              <div className="Registry__header">
                <h2 className="Registry__title">Платежи на сегодня: {today} </h2>
                
              </div>
              <Total payments={todaysPayments}/>
            </div>
            <Account 
                    registry={registry} 
                    approve={approveHandler}
                    cancelApprove={cancelApproveHandler}
                    stopRepeatability={stopRepeatabilityHandler}
                    payments={todaysPayments}/>
        </div>
    )
};

export default RegistryForApprove;