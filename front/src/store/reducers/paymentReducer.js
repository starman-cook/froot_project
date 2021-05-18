const { FETCH_PAYMENTS_SUCCESS, FETCH_TODAYS_PAYMENTS_SUCCESS, FETCH_STATUS_SUCCESS, FETCH_PAYMENT_BY_ID_SUCCESS, FETCH_TODAYS_FILES_SUCCESS, FETCH_PAYMENTS_FAILURE } = require("../actions/paymentAction");

const initialState = {
  payments: [],
  paymentsError: null,
  paymentById: {},
  todaysPayments: [],
  todayFiles: []
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PAYMENTS_SUCCESS:
      return { ...state, payments: action.payments };
    case FETCH_PAYMENTS_FAILURE:
      return { ...state, paymentsError: action.error };
    case FETCH_PAYMENT_BY_ID_SUCCESS:
      return { ...state, paymentById: action.payment };
    case FETCH_TODAYS_PAYMENTS_SUCCESS:
      return {...state, todaysPayments: action.payments};
    case FETCH_TODAYS_FILES_SUCCESS:
      return {...state, todayFiles: action.files};
    case FETCH_STATUS_SUCCESS:
      return {...state,todaysPayments:
        [... state.todaysPayments.map(element => {
        if(element._id === action.payment._id) {
          return action.payment
        }
        else return element
      })], payments:
    [...state.payments.map(element => {
      if(element._id === action.payment._id) {
        return action.payment
      }
      else return element
    })]}
    default:
      return { ...state };
  }
};

export default paymentReducer;
