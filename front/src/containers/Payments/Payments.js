import { push } from "connected-react-router";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account from "../../components/Account/Account";
import RedirectToAuth from "../../components/RedirectToAuth/RedirectToAuth";
import Total from "../../components/Total/Total";
import ButtonPink from "../../components/UI/Buttons/ButtonPink/ButtonPink";
import ButtonWhite from "../../components/UI/Buttons/ButtonWhite/ButtonWhite";
import Modal from "../../components/UI/Modal/Modal";
import UsersPermission from "../../components/UsersPermission/UsersPermission";
import {
  fetchPayments,
  fetchSortedData,
} from "../../store/actions/paymentAction";
import './Payments.css';

const Payments = () => {
  const payments = useSelector((state) => state.payments.payments);
  const user = useSelector(state => state.users.user);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    payer: "",
    dateOfPayment: {
      fromDate: "",
      toDate: "",
    },
    approved: "",
    paided: ""
  });
  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const clearData = () => {
    let dropText = document.getElementById('dropdown');
    dropText.innerText='Статус платежа';
    setState({payer: "",
    dateOfPayment: {
      fromDate: "",
      toDate: "",
    },
    approved: "",
    paided: ""})
    dispatch(fetchPayments());
    return
  };
  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  const inputDateChangeHandler = (event) => {
    const { name, value } = event.target;
    const stateCopy = { ...state.dateOfPayment, [name]: value };
    setState((prevState) => {
      return { ...prevState, dateOfPayment: { ...stateCopy } };
    });
  };
  const statusChangeHandler = e => {
    let dropText = document.getElementById('dropdown');
    const value = e.target.innerText
    dropText.innerText = value;
    if(value === "Не подтвержден") {
      setState((prevState) => {
        return { ...prevState, approved: false, paided: false };
      });
    }else if (value === "Подтвержден") {
      setState((prevState) => {
        return { ...prevState, approved: true, paided: false };
      });
    }else if (value === "Оплачен") {
      setState((prevState) => {
        return { ...prevState, approved: true, paided: true };
      });
    }
    if (e.target !== e.currentTarget) {
      return;
    }
  }
  const postData = async () => {
    let stateCopy = { ...state };
    if (!stateCopy.dateOfPayment.fromDate && !stateCopy.dateOfPayment.toDate) {
      stateCopy = { ...stateCopy, dateOfPayment: "" };
    } else if (
      stateCopy.dateOfPayment.fromDate &&
      !stateCopy.dateOfPayment.toDate
    ) {
      stateCopy = {
        ...stateCopy,
        dateOfPayment: {
          fromDate: stateCopy.dateOfPayment.fromDate,
          toDate: stateCopy.dateOfPayment.fromDate,
        },
      };
    } else if (
      !stateCopy.dateOfPayment.fromDate &&
      stateCopy.dateOfPayment.toDate
    ) {
      stateCopy = {
        ...stateCopy,
        dateOfPayment: {
          toDate: stateCopy.dateOfPayment.toDate,
          fromDate: stateCopy.dateOfPayment.toDate,
        },
      };
    }
    dispatch(fetchSortedData(stateCopy));
  };
  // --для фильтра--
  const [showModal, setShowModal] = useState({
    show: false
  });
  const openModal = () => {
    setShowModal({ show: true });
  }
  const closeModal = () => {
    setShowModal({ show: false })
  }
  const body = (
    <form>
      <div className="Payments__filter">
        <div className="Payments__filter-item">
          <h3 className="Payments__filter-title">По компании:</h3>
          <select
            className="Payments__filter-select"
            name="payer"
            value={state.payer}
            onChange={e => inputChangeHandler(e)}
          >
            <option value="">Все компании</option>
            <option value="Froot_Middle_Asia">Froot_Middle_Asia</option>
            <option value="Froot_Бизнес">Froot_Бизнес</option>
          </select>
        </div>
        <div className="Payments__filter-item Payments__filter-date">
          <h3 className="Payments__filter-title">По дате:</h3>
          <div className="Payments__filter-date-content">
            <div className="Payments__filter-date-item">
              <span>с</span>
              <input
                className="Payments__filter-input"
                type="date"
                onChange={(e) => inputDateChangeHandler(e)}
                name="fromDate"
              />
            </div>
            <div className="Payments__filter-date-item">
              <span>до</span>
              <input
                className="Payments__filter-input"
                type="date"
                onChange={(e) => inputDateChangeHandler(e)}
                name="toDate"
              />
            </div>
          </div>
        </div>
        <div className="Payments__filter-item dropdown">
          <h3 className="Payments__filter-title">По статусу:</h3>
          <span id="dropdown" className="dropdown__title">Статусы платежей</span>
          <div className="dropdown__content">
            <div className="dropdown__content-item" onClick={e=>statusChangeHandler(e)}>Подтвержден</div>
            <div className="dropdown__content-item" onClick={e=>statusChangeHandler(e)}>Не подтвержден</div>
            <div className="dropdown__content-item" onClick={e=>statusChangeHandler(e)}>Оплачен</div>
          </div>
        </div>
      </div>
      <div className="Payments__filter-control">
        <ButtonPink type='button' text='Применить' onClickHandler={postData}/>
        <ButtonWhite type='reset' text='Сброс' onClickHandler={clearData}/>
      </div>
    </form>      
  )

  return (
    <Fragment>
      {user && <div className="Payments">
        {user.role.includes('viewAllPayments') ? (
          <Fragment>
            <div className="Payments__content">
              <div className="Payments__header">
                <h2 className="Payments__title">Все платежи</h2>
                <div className="Payments__filter-btn">
                  <ButtonPink type='button' text='Фильтры' onClickHandler={openModal}/>
                  {showModal.show && <Modal body={body} name={'filter'} close={closeModal} />}
                </div>
              </div>
              {payments.length && <Total payments={payments}/>}
           </div>
        <Account payments={payments}
          statusDateChange = {statusChangeHandler}
          />
          </Fragment>
        ): (<UsersPermission/>)}
        
      </div> }
    </Fragment>
  );
};

export default Payments;
