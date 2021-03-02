import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Header from './Header/Header'
import NotFound from './NotFound'

import AdCenter from './Admin/AdCenter/Main'

import Users from './Admin/Users/Users'
import UserPage from './Admin/Users/UserPage'

export default function Routes(props) {

    if (!props.login)
        return <NotFound />   

    return <BrowserRouter>
    
        <div className="d-flex flex-column" id="sub-root">

        <Header />

            <Switch>

                {/* <Route path="/login" component={Login} /> */}

                <Route exact path="/" component={AdCenter} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/users/:id" component={UserPage} />
                
                <Route path="*" component={NotFound} />

            </Switch>

        </div>

    </BrowserRouter>



}