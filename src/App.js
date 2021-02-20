import React from 'react'
import Routes from './components/Routes'

import axios from './utils/axios'
import { Loader } from 'semantic-ui-react'

import './App.css';

export default function App() {

    const [login, setLogin] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {

        axios.post('/checkUser').then(({ data }) => {

            setLogin(true);

            window.user = data.user;
            window.access = data.access;
            window.sip = data.sip;

        }).catch(error => {
            setLogin(false);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    if (loading) {
        return <div className="loading-page">
            <Loader active inline="centered" />
        </div>
    }

    return <div id="sub-root">
        <Routes login={login} />
    </div>

}