import { push } from "connected-react-router";
import axiosApi from "../../axiosApi";

export const FETCH_PAYMENTS_SUCCESS = "FETCH_PAYMENTS_SUCCESS";
export const FETCH_PAYMENT_BY_ID_SUCCESS = "FETCH_PAYMENT_BY_ID_SUCCESS";
export const CREATE_PAYMENT_SUCCESS = "CREATE_PAYMENT_SUCCESS";
export const FETCH_TODAYS_PAYMENTS_SUCCESS = "FETCH_TODAYS_PAYMENTS_SUCCESS";
export const FETCH_STATUS_SUCCESS = "FETCH_STATUS_SUCCESS";
export const EDIT_DATA_SUCCESS = "EDIT_DATA_SUCCESS";

export const fetchPaymentsSuccess = (payments) => {
  return { type: FETCH_PAYMENTS_SUCCESS, payments };
};
export const fetchPaymentByIdSuccess = (payment) => {
  return { type: FETCH_PAYMENT_BY_ID_SUCCESS, payment}
}
export const createPaymentSuccess = (payment) => {
  return { type: FETCH_PAYMENTS_SUCCESS, payment };
};
export const fetchTodaysPaymentsSuccess = payments => {
  return {type: FETCH_TODAYS_PAYMENTS_SUCCESS, payments};
};
export const fetchStatusSuccess = (payment)=>{
  return {type:FETCH_STATUS_SUCCESS,payment}
};

export const fetchPaid = id => {
  return async dispatch => {
    try {
      const response = await axiosApi.post('/payments/'+id+'/paid');
      dispatch(fetchStatusSuccess(response.data));
    } catch(e) {
      console.error(e);
    }
  }
}
export const fetchApprove = id => {
  return async dispatch => {
    try {
      const response = await axiosApi.post('/payments/'+id+'/approved');
      dispatch(fetchStatusSuccess(response.data));
    } catch(e) {
      console.error(e);
    }
  }
}
export const fetchTodaysPayments = () => {
  return async dispatch => {
    try {
      const response = await axiosApi.get('/payments/due/today');
      dispatch(fetchTodaysPaymentsSuccess(response.data));
    } catch(e) {
      console.error(e);
    }
  }
};
export const fetchSortedData = (data) => {
  return async (dispatch) => {
    try {
      const response = await axiosApi.post("/payments/filter", data);
      console.log('response', response.data)
      dispatch(fetchPaymentsSuccess(response.data));
    } catch (e) {
      console.error(e);
    }
  };
};

export const fetchPayments = () => {
  return async (dispatch) => {
    try {
      const response = await axiosApi.get("/payments");
      dispatch(fetchPaymentsSuccess(response.data));
    } catch (e) {
      console.error(e);
    }
  };
};
export const fetchPaymentById = (id) => {
  return async (dispatch) => {
    try {
      const response = await axiosApi.get(`/payments/${id}`);
      dispatch(fetchPaymentByIdSuccess(response.data));
      return Promise.resolve(response.data)
    } catch (e) {
      console.error(e);
    }
  };
};

export const createPayment = (payment) => {
  console.log("payment", payment)
  return async (dispatch) => {
    try {
      await axiosApi.post("/payments", payment);
      dispatch(push("/"));
    } catch (e) {
      console.error(e);
    }
  };
};
export const editPayment = (id, paymentData) => {
  return async (dispatch) => {
    try {
      const resp = await axiosApi.put(`/payments/${id}/edit`, paymentData);
      dispatch(push("/"));
    } catch (e) {
      console.error(e);
    }
  };
};
