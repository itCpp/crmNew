import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import NotFound from './NotFound'
import AdCenter from './Admin/AdCenter/Main'

export default function Routes(props) {

    if (!props.login)
        return <NotFound />

    return <BrowserRouter>

        <Switch>

            {/* <Route path="/login" component={Login} /> */}

            <Route exact path="/" component={AdCenter} />
            
            <Route path="*" component={NotFound} />

        </Switch>

    </BrowserRouter>

}