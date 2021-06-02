import React, { useState } from "react";
import { useSelector } from "react-redux";
import { apiURL } from "../../config";
import Modal from "../UI/Modal/Modal";
import icon from "../../assets/images/icon-eye.png"
import './Account.css';
import { NavLink } from "react-router-dom";
import {download} from '../../../src/functions'


const Account = ({ registry, payments, approve, cancelApprove, pay, cancelPay, stopRepeatability, statusDateChange }) => {
  const user = useSelector(state => state.users.user);

  // --для модалки--
  const [showModal, setShowModal] = useState({
    show: false,
    src: ""
  });
  const openModal = (src) => {
    setShowModal({ show: true, src });
  }
  const closeModal = () => {
    setShowModal({ show: false })
  }
 
  return (
    <>
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID платежа</th>
            <th>Дата платежа</th>
            <th>Компания</th>
            <th>Назначение</th>
            <th>Договор/Счет</th>
            <th>Контрагент</th>
            <th>Приоритет</th>
            <th>Сумма платежа</th>
            <th>Инициатор</th>
            <th>Файл</th>
            <th>Повтор платежа</th>
            <th>Статус платежа</th>                        
          </tr>
        </thead>
        <tbody>
          {payments && payments.map((payment, index) => (
            <tr key={index}>
              <td>
                <div className="flex-space">
                  {payment._id}
                  <NavLink to={`/payments/${payment._id}`}>
                    <img className="icon" src={icon} />
                  </NavLink>
                </div>
              </td>
              <td>{payment.dateOfPayment}</td>
              <td>{payment.payer}</td>
              <td>{payment.purpose}</td>
              <td>{payment.invoice}</td>
              <td>{payment.contractor}</td>
              <td>{payment.priority}</td>
              <td>{payment.sum}</td>
              <td>{`${payment.user && payment.user.surname} ${payment.user && payment.user.name}`}</td>
              <td>{payment.image? <>
                <a className='Account__btn_img' onClick={() => openModal(apiURL + "/uploads/" + payment.image)}>Посмотреть</a><br />
                <a className='Account__btn_img' onClick={()=> download(apiURL + "/uploads/" + payment.image, "file.jpg")}>Скачать</a>
                </> : <span>Файл отсутствует</span>
              }                                
              </td>
              {registry && user && (user._id===payment.user._id || user.role.includes('approvePayment'))?<td>
                {payment.repeatability? (
                  <div className="flex-space"> 
                    <span >да</span>
                    <button className="Account__btn" onClick={() => stopRepeatability(payment._id)}>Отменить</button>
                  </div>
                  ): <span >нет</span>}
                </td>:user && user.role.includes('viewAllPayments') && <td>
                {!payment.repeatability? <span >нет</span> : <span >да</span>}</td>}
              {!registry && user && user.role.includes('viewAllPayments') && <td onClick ={e => statusDateChange(e)}>
                {!payment.approved && <span style={{ color: 'red' }}>Не подтвержден</span>}
                {payment.approved && !payment.paided && <span style={{ color: 'orange' }}>Подтвержден</span>}
                {payment.approved && payment.paided && <span style={{ color: 'green' }}>Оплачен</span>}</td>}                               
              {registry && user && user.role.includes('approvePayment') && <td>
                {!payment.approved? (
                  <div className="flex-space">
                    <span style={{ color: 'red' }}>Не подтвержден</span>
                    <button className="Account__btn" onClick={() => approve(payment._id)}>Подтвердить</button>
                  </div>
                  ): (
                  <div className="flex-space">
                    <span style={{ color: 'orange' }}>Подтвержден</span>
                    <button className="Account__btn" onClick={() => cancelApprove(payment._id)}>Отменить</button>
                  </div>)}
                </td>}
              {registry && user && user.role.includes('payPayment') && !user.role.includes('approvePayment') && payment.approved && <td>
                {!payment.paided? (
                  <>
                  <span style={{ color: 'orange' }}>Подтвержден</span>
                  <button className="Account__btn" onClick={() => pay(payment._id)}>Оплатить</button>
                  </>):(
                  <>
                  <span style={{ color: 'green' }}>Оплачен</span>
                  <button className="Account__btn" onClick={() => cancelPay(payment._id)}>Отменить</button>
                  </>)}
                </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      {showModal.show && <Modal src={showModal.src} close={closeModal} />}
    </>
  );
};

export default Account;
