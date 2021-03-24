import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account from "../../components/Account/Account";
import {
  fetchPayments,
  fetchSortedData,
} from "../../store/actions/paymentAction";
import './Payments.css';

const Payments = () => {
  const payments = useSelector((state) => state.payments.payments);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    payer: "",
    dateOfPayment: {
      fromDate: "",
      toDate: "",
    },
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
  // const statusOnClickHandler = async status => {
  //   await dispatch(fetchSortedData(status));
  // }
  // console.log('statusOnClickHandler',statusOnClickHandler)

  return (
    <div className="Payments">
      <h2 className="Payments__title">Все платежи</h2>
      <div className="Payments__total">
                <h3>Общая сумма платежей по компаниям:</h3>
                <div className="flex-space">
                    <span className="Payments__total-company">"Froot_Middle_Asia": <strong>{totalAsia}</strong> KZT</span>
                    <span className="Payments__total-company">"Froot_Бизнес": <strong>{totalBusiness}</strong> KZT</span>
                </div>
            </div>
      <div style={{display: 'flex', alignItems: 'center', maxWidth: "60%", margin: "0 auto" }}>
         <select
            name="payer"
            value={state.payer}
            onChange={e => inputChangeHandler(e)}
        >
          <option disabled value="Выберите компанию-плательщика">Выберите компанию-плательщика</option>
          <option value="Froot_Middle_Asia">Froot_Middle_Asia</option>
          <option value="Froot_Бизнес">Froot_Бизнес</option>
        </select>

        <p>FROM</p>

        <input
          type="date"
          onChange={(e) => inputDateChangeHandler(e)}
          name="fromDate"
        />
        <p>TO</p>

        <input
          type="date"
          onChange={(e) => inputDateChangeHandler(e)}
          name="toDate"
        />
        <button className="Payments__btn" onClick={() => postData()}>Apply filter</button>
      </div>
      <Account payments={payments}
        />
    </div>
  );
};

export default Payments;
