import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Auth from './Auth/Auth';
import Header from './Header/Header';
import Crm from './CRM/CRM';
import Admin from './Admin/AdminMain';

import GlobalError from "./Errors/GlobalError";
import NotFound from './NotFound';

export default function Routes(props) {

    const { login, globalError } = props;

    if (globalError)
        return <GlobalError error={globalError} />

    if (!login)
        return <Auth />

    return <BrowserRouter>

        <div className="d-flex flex-column" id="sub-root">

            <Header />

            <Switch>

                <Route exact path="/" component={Crm} />
                <Route exact path="/requests" component={Crm} />
                <Route exact path="/queues" component={Crm} />
                <Route exact path="/sms" component={Crm} />
                <Route exact path="/secondcalls" component={Crm} />
                <Route exact path="/pins" component={Crm} />
                <Route exact path="/rating" component={Crm} />

                <Route exact path="/user/:id" component={Crm} />

                <Route exact path="/admin" component={Admin} />
                <Route exact path="/admin/:page" component={Admin} />
                <Route exact path="/admin/:page/:type" component={Admin} />

                {/* <Route exact path="/users" component={Users} />
                <Route exact path="/users/:id" component={UserPage} />

                <Route path="/gates/:type" component={GatesMain} />
                <Route path="/gates" component={GatesMain} /> */}

                <Route path="*" component={NotFound} />

            </Switch>

        </div>

    </BrowserRouter>

}