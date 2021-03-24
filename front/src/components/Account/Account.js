import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiURL } from "../../config";
import { fetchApprove, fetchPaid, fetchPayments, fetchSortedData, fetchTodaysPayments } from "../../store/actions/paymentAction";
import Modal from "../UI/Modal/Modal";
import icon from"../../assets/images/icon-eye.png"
import './Account.css';
import { NavLink } from "react-router-dom";

const Account = ({ registry, payments, onClick }) => {
  const user = useSelector(state => state.users.user);
  
  // const paymentsSorted = useSelector(state => state.payments.payments);
  
  const dispatch = useDispatch();
  const [approved, setApproved] = useState(false);
    const [showModal, setShowModal] = useState({
        show: false,
        src:""
    });
    
    const openModal = (src) => {
        setShowModal({show: true,src});
    }

    const closeModal = () => {
        setShowModal({show: false})
    }
    const approve = (id) => {
      dispatch(fetchApprove(id));
      setApproved(!approved);
    };
    const pay = (id) => {
      dispatch(fetchPaid(id));
      setApproved(!approved);
    }
    const statusOnClickHandler =  event => {
      let status = event.target.innerText
      if(status==="Не подтвержден"){
        status = {approved: false};
      } else if(status==="Подтвержден"){
        status = {approved: true};
      } else {
        status = {paided: true};
      }
      console.log(onClick)
      onClick(status)
      // await dispatch(fetchSortedData(status));
    }
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>ID платежа</th>
            <th>Дата платежа</th>
            <th>Компания</th>
            <th>Назначение</th>
            <th>Основание договора/счета</th>
            <th>Контрагент</th>
            <th>Приоритет</th>
            <th>Сумма платежа</th>
            <th>Инициатор</th>
            <th>Файл</th>
            <th>Статус платежа</th>
            {registry && user && user.role === 'director' && <th>Кнопка подтверждения</th>}
            {registry && user && user.role === 'accountant' && <th>Кнопка оплаты</th>}
          </tr>
        </thead>
        <tbody>
          {payments && payments.map((payment,index) => (
            <tr key={index}>
              <td className="Account__id flex-space">{payment._id} 
                <NavLink to={`/payments/${payment._id}`}>
                  <img className="icon" src={icon}/>
                </NavLink></td>
              <td>{payment.dateOfPayment}</td>
              <td>{payment.payer}</td>
              <td>{payment.purpose}</td>
              <td>{payment.invoice}</td>
              <td>{payment.contractor}</td>
              <td>{payment.priority}</td>
              <td>{payment.sum}</td>
              <td>{`${payment.user.surname} ${payment.user.name}`}</td>
              <td>
                  <span onClick={()=>openModal(apiURL + "/uploads/" + payment.image)}>Посмотреть</span><br/>
                  <a href={apiURL + "/uploads/"+payment.image} download>Скачать</a>
              </td>
              <td onClick={(e) => statusOnClickHandler(e)}>{!payment.approved && <span style={{color: 'red'}}>Не подтвержден</span>}
                  {payment.approved && !payment.paided && <><span style={{color: 'orange'}}>Подтвержден</span>
                    {/* <br/><span style={{color: 'red'}}>Не оплачен</span> */}
                    </>}
                  {payment.approved && payment.paided && <span style={{color: 'green'}}>Оплачен</span>}
              </td>
              
              {registry && user && user.role === 'director' && <td>
              {!payment.approved && <button onClick={() => approve(payment._id)}>Подтвердить</button>}
              </td>}
              {registry && user && user.role === 'accountant' && payment.approved && <td>
              {!payment.paided && <button onClick={() => pay(payment._id)}>Оплатить</button>}
              </td>}
              
            </tr>
          ))}
        </tbody>
      </table>
      {showModal.show &&<Modal show={showModal.show} src={showModal.src} close={closeModal}/>}
    </>
  );
};

export default Account;
