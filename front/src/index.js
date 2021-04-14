import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { store, history } from "./store/configureStore";
import axiosApi from "./axiosApi";

const app = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

axiosApi.interceptors.request.use(req => {
  try {
    req.headers['Authorization'] = store.getState().users.user ? store.getState().users.user.token[0] : ''
  } catch (err) {
    console.log(err);
  }
  return req;
});

ReactDOM.render(app, document.getElementById("root"));