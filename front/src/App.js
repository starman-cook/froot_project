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
import AddRole from "./containers/AddRole/AddRole";
import RegistryForAccountant from "./containers/RegistryForAccountant/RegistryForAccountant";
import RegistryForApprove from "./containers/RegistryForApprove/RegistryForApprove";
import Calendar from "./containers/Calendar/Calendar";
import ContentManagerForm from "./containers/ContentManagerForm/ContentManagerForm";
import ContenLinksReport from "./containers/ContentLinksReport/ContentLinksReport";
import BigBrother from "./components/BigBrother/BigBrother";

const App = () => {
  const user = useSelector(state => state.users.user);
  return (
    <>

      <Switch>
        <Route path="/bigbrother" exact component={BigBrother} />
        <Route>
          <Header user={user} />
          <main className="App__main">
            <Switch>
              <ProtectedRoute
                isAllowed={
                  user && user.role.includes("viewAllPayments")
                }
                redirectTo={'/login'}
                path="/"
                exact
                component={Payments}
              />
              <Route path="/registry" exact component={Registry} />
              <ProtectedRoute
                isAllowed={
                  user && user.role.includes("approvePayment")
                }
                redirectTo={'/'}
                path="/approve-registry"
                exact
                component={RegistryForApprove}
              />
              <ProtectedRoute
                isAllowed={
                  user && user.role.includes("payPayment")
                }
                redirectTo={'/'}
                path="/pay-registry"
                exact
                component={RegistryForAccountant}
              />
              <ProtectedRoute
                isAllowed={user && user.role.includes("addPayment")}
                redirectTo={"/"}
                path="/new-payment"
                exact
                component={AddPayment}
              />
              <ProtectedRoute
                isAllowed={user && user.role.includes('viewBookingsMeetingRoom')}
                redirectTo={"/"}
                path="/meetings"
                exact
                component={Calendar}
              />
              <Route path="/payments/:id" exact component={PaymentById} />
              <ProtectedRoute
                isAllowed={user}
                redirectTo={"/"}
                path="/payments/:id/edit"
                exact
                component={EditPayment}
              />
              <ProtectedRoute
                isAllowed={user && user.role.includes('deleteUser')}
                redirectTo={"/"}
                path="/admin-panel"
                exact
                component={AdminPanel}
              />
              <ProtectedRoute
                isAllowed={user && user.role.includes('deleteUser')}
                redirectTo={"/"}
                path="/users/:id/edit"
                exact
                component={Employee}
              />
              <ProtectedRoute
                isAllowed={user && user.role.includes('deleteUser')}
                redirectTo={"/"}
                path="/users/:id/role"
                exact
                component={AddRole}
              />
              <ProtectedRoute
                isAllowed={user && user.role.includes('addContentlink')}
                redirectTo={"/"}
                path="/content-manager"
                exact
                component={ContentManagerForm}
              />
              <ProtectedRoute
                isAllowed={user && user.role.includes('viewAllContentlinks')}
                redirectTo={"/"}
                path="/content-report"
                exact
                component={ContenLinksReport}
              />
              <Route path="/news" exact component={News} />
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
              <Route component={() => (<div>404 PAGE NOT FOUND</div>)} />
            </Switch>
          </main>
        </Route>
      </Switch>

    </>
  );
};

const ProtectedRoute = ({ isAllowed, redirectTo, ...props }) => {
  return isAllowed ? <Route {...props} /> : <Redirect to={redirectTo} />;
};

export default App;
