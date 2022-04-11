import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { TESTING_URL } from "./Testing";
import Auth from "./Auth/Auth";
import Header from "./Header/Header";
import GlobalError from "./Errors/GlobalError";
import NotFound from "./NotFound";
import { Loader } from "semantic-ui-react";
const Admin = React.lazy(() => import("./Admin/AdminMain"));
const Crm = React.lazy(() => import("./CRM/CRM"));
const Testing = React.lazy(() => import("./Testing"));

export default function Routes(props) {

    const { login, globalError, hidden } = props;

    if (globalError)
        return <GlobalError error={globalError} />

    if (!login && !hidden)
        return <Auth />

    return <BrowserRouter>

        <div className="d-flex flex-column" id="sub-root">

            {!hidden && <Header />}

            <React.Suspense fallback={<div className="mt-4"><Loader active indeterminate inline="centered" /></div>}>

                <Switch>

                    <Route exact path="/" component={Crm} />
                    <Route exact path="/requests" component={Crm} />
                    <Route exact path="/queues" component={Crm} />
                    <Route exact path="/sms" component={Crm} />
                    <Route exact path="/secondcalls" component={Crm} />
                    <Route exact path="/pins" component={Crm} />
                    <Route exact path="/rating" component={Crm} />
                    <Route exact path="/charts" component={Crm} />
                    <Route exact path="/mytests" component={Crm} />
                    <Route exact path="/agreements" component={Crm} />
                    <Route exact path="/user/:id" component={Crm} />
                    <Route exact path="/fines" component={Crm} />
                    <Route exact path="/consultations" component={Crm} />

                    <Route exact path="/admin" component={Admin} />
                    <Route exact path="/admin/:page" component={Admin} />
                    <Route exact path="/admin/:page/:type" component={Admin} />

                    {/* <Route exact path="/users" component={Users} /> */}
                    {/* <Route exact path="/users/:id" component={UserPage} /> */}
                    {/* <Route path="/gates/:type" component={GatesMain} /> */}
                    {/* <Route path="/gates" component={GatesMain} /> */}

                    <Route path={`/${TESTING_URL}`} component={Testing} />

                    <Route path="*" component={NotFound} />

                </Switch>

            </React.Suspense>

        </div>

    </BrowserRouter>

}