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
import AdminPanel from "./containers/AdminPanel/AdminPanel";
import Employee from "./containers/Employee/Employee";
import EditPayment from "./containers/EditPayment/EditPayment";
import PaymentById from "./containers/PaymentById/PaymentById";
import AddRole from "./containers/AddRole/AddRole";
import RegistryForAccountant from "./containers/RegistryForAccountant/RegistryForAccountant";
import RegistryForApprove from "./containers/RegistryForApprove/RegistryForApprove";
import Calendar from "./containers/Calendar/Calendar";
import ContentManager from "./containers/ContentManager/ContentManager";
// import ContenLinksReport from "./containers/ContentLinksReport/ContentLinksReport";
// import AllContent from "./containers/ContentManager/ContentManager";
import MyEvents from "./containers/MyEvents/MyEvents";
import MyEvents_Applications from "./containers/MyEvents/MyEvents_Applications/MyEvents_Applications";
import MyEvents_CalendarEvents from "./containers/MyEvents/MyEvents_CalendarEvents/MyEvents_CalendarEvents";
import MyEvents_Instructions from "./containers/MyEvents/MyEvents_Instructions/MyEvents_Instructions";

const App = () => {
  const user = useSelector(state => state.users.user);
  return (
    <>

          <Header user={user} />
          <main className="App__main">
            <Switch>
              <ProtectedRoute
                isAllowed={user}
                redirectTo={'/login'}
                path="/"
                exact
                component={Payments}
              />
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
                component={ContentManager}
              />
              {/* <ProtectedRoute
                isAllowed={user && user.role.includes('viewAllContentlinks')}
                redirectTo={"/"}
                path="/content-report"
                exact
                component={ContenLinksReport}
              /> */}
              <ProtectedRoute
                  isAllowed={user}
                  redirectTo={"/"}
                  path="/myEvents"
                  exact
                  component={MyEvents}
              />

              <ProtectedRoute
                  isAllowed={user}
                  redirectTo={"/"}
                  path="/myEvents_applications"
                  exact
                  component={MyEvents_Applications}
              />
              <ProtectedRoute
                  isAllowed={user}
                  redirectTo={"/"}
                  path="/myEvents_calendarEvents"
                  exact
                  component={MyEvents_CalendarEvents}
              />
              <ProtectedRoute
                  isAllowed={user}
                  redirectTo={"/"}
                  path="/myEvents_instructions"
                  exact
                  component={MyEvents_Instructions}
              />

              <Route path="/news" exact component={News} />
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
              <Route component={() => (<div>404 PAGE NOT FOUND</div>)} />
            </Switch>
          </main>

    </>
  );
};

const ProtectedRoute = ({ isAllowed, redirectTo, ...props }) => {
  return isAllowed ? <Route {...props} /> : <Redirect to={redirectTo} />;
};

export default App;
