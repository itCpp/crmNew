import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AdCenter from './Admin/AdCenter/Main'

export default function Routes(props) {

    // console.log(props)

    return <BrowserRouter>

        <Switch>

            {/* <Route path="/login" component={Login} /> */}

            <Route path="/" component={AdCenter} />

        </Switch>

    </BrowserRouter>

}