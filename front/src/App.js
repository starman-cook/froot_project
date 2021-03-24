import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
import AddPayment from "./containers/AddPayment/AddPayment";
import News from "./containers/News/News";
import Payments from "./containers/Payments/Payments";
import "./App.css"
import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";
import Registry from "./containers/Registry/Registry";
import AdminPanel from "./containers/AdminPanel/AdminPanel";
import Employee from "./containers/Employee/Employee";
import EditPayment from "./containers/EditPayment/EditPayment";
import PaymentById from "./containers/PaymentById/PaymentById";

const App = () => {
  const user = useSelector(state=>state.users.user);
  return (
    <>
      <Header user={user}/>
      <main className="App__main">
        <Switch>
          <Route path="/" exact component={Payments} />
          <Route path="/registry" exact component={Registry} />
          <ProtectedRoute
              isAllowed={user}
              redirectTo={"/login"}
              path="/new-payment"
              exact
              component={AddPayment}
            />
          <Route path="/payments/:id" exact component={PaymentById} />
          <Route path="/payments/:id/edit" exact component={EditPayment} />
          <Route path="/admin-panel" exact component={AdminPanel} />
          <Route path="/users/:id/edit" exact component={Employee} />
          <Route path="/news" exact component={News} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
          <Route component={()=>(<div>404 PAGE NOT FOUND</div>)}/>
        </Switch>
      </main>
    </>
  );
};

const ProtectedRoute = ({ isAllowed, redirectTo, ...props }) => {
  return isAllowed ? <Route {...props} /> : <Redirect to={redirectTo} />;
};

export default App;
