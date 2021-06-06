import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { loadFromLocalStorage, saveToLocalStorage } from "./localStorage";
import paymentReducer from "./reducers/paymentReducer";
import usersReducer from "./reducers/usersReducer";
import calendarReducer from "./reducers/calendarReducer";
import contentReducer from "./reducers/contentReducer";
import newsReducer from "./reducers/newsReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const history = createBrowserHistory();

const rootReducer = combineReducers({
  payments: paymentReducer,
  users: usersReducer,
  calendarEvents: calendarReducer,
  contentManagers:contentReducer,
  news: newsReducer,
  router: connectRouter(history),
});

const middleware = [thunkMiddleware, routerMiddleware(history)];

const enhancers = composeEnhancers(applyMiddleware(...middleware));

const persistedState = loadFromLocalStorage();

export const store = createStore(rootReducer, persistedState, enhancers);

store.subscribe(() => {
  saveToLocalStorage({
    users: {
      user: store.getState().users.user,
    },
  });
});
