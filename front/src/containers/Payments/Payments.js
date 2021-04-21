import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account from "../../components/Account/Account";
import RedirectToAuth from "../../components/RedirectToAuth/RedirectToAuth";
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

  let totalAsia = 0
    payments.filter((payment) => {
        if(payment.payer === "Froot_Middle_Asia"){
            totalAsia += Number(payment.sum)
        }
        return totalAsia
    });
    let totalBusiness = 0
    payments.filter((payment) => {
        if(payment.payer === "Froot_Бизнес"){
            totalBusiness += Number(payment.sum)
        }
        return totalBusiness
    });
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
  
  return (
    <Fragment>
      {user ? <div className="Payments">
        <h2 className="Payments__title">Все платежи</h2>
        <div className="Payments__total">
                  <h3>Общая сумма платежей по компаниям:</h3>
                  <div className="flex-space">
                      <span className="Payments__total-company">"Froot_Middle_Asia": <strong>{totalAsia}</strong> KZT</span>
                      <span className="Payments__total-company">"Froot_Бизнес": <strong>{totalBusiness}</strong> KZT</span>
                  </div>
              </div>
        <div className="Payments__filter">
          <select
              name="payer"
              value={state.payer}
              onChange={e => inputChangeHandler(e)}
          >
            <option value="">Все компании</option>
            <option value="Froot_Middle_Asia">Froot_Middle_Asia</option>
            <option value="Froot_Бизнес">Froot_Бизнес</option>
          </select>

          <p>с</p>

          <input
            type="date"
            onChange={(e) => inputDateChangeHandler(e)}
            name="fromDate"
          />
          <p>до</p>

          <input
            type="date"
            onChange={(e) => inputDateChangeHandler(e)}
            name="toDate"
          />
          <div className="dropdown">
            <span id="dropdown" className="dropdown__title">Статусы платежей</span>
            <div className="dropdown__content">
              <div className="dropdown__content-item" onClick={e=>statusChangeHandler(e)}>Не подтвержден</div>
              <div className="dropdown__content-item" onClick={e=>statusChangeHandler(e)}>Подтвержден</div>
              <div className="dropdown__content-item" onClick={e=>statusChangeHandler(e)}>Оплачен</div>
            </div>

          </div>

          <button className="Payments__btn" onClick={() => postData()}>Применить</button>
        </div>
        <Account payments={payments}
          statusDateChange = {statusChangeHandler}
          />
      </div> : <RedirectToAuth/>}
    </Fragment>
  );
};

export default Payments;
