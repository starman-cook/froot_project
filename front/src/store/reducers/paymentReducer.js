const { FETCH_PAYMENTS_SUCCESS, FETCH_TODAYS_PAYMENTS_SUCCESS, FETCH_STATUS_SUCCESS, FETCH_PAYMENT_BY_ID_SUCCESS } = require("../actions/paymentAction");

const initialState = {
  payments: [],
  paymentById: {},
  todaysPayments: []
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PAYMENTS_SUCCESS:
      return { ...state, payments: action.payments };
    case FETCH_PAYMENT_BY_ID_SUCCESS:
      return { ...state, paymentById: action.payment };
    case FETCH_TODAYS_PAYMENTS_SUCCESS:
      return {...state, todaysPayments: action.payments};
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
