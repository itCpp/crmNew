import React from 'react';
import axios from './utils/axios-header';
import connectEcho from "./utils/echo-connect";

import { connect } from 'react-redux';
import { setLogin, setUserData, setUserPermits, setAuthQueriesCount } from './store/actions';

import { Loader } from 'semantic-ui-react';
import { SemanticToastContainer } from 'react-semantic-toasts';

import './App.css';

import Routes from './components/Routes';

function App(props) {

    const { login, setLogin, setUserData, setUserPermits } = props;
    const [loading, setLoading] = React.useState(true);

    React.useEffect(async () => {

        axios.post('/check').then(({ data }) => {

            setLogin(true);
            setUserData(data.user);
            setUserPermits(data.permits);
            props.setAuthQueriesCount(data.authQueries);

        }).catch(error => {

            if (error?.response?.status === 401)
                setLogin(false);

        }).then(async () => {
            setLoading(false);
            await connectEcho();
        });

    }, []);

    if (loading) {
        return <div className="loading-page">
            <Loader active inline="centered" />
        </div>
    }

    return <>
        <SemanticToastContainer position="bottom-left" />
        <Routes login={login} />
    </>

}

const mapStateToProps = state => ({
    login: state.main.login,
});

const mapDispatchToProps = {
    setLogin, setUserData, setUserPermits, setAuthQueriesCount
}

export default connect(mapStateToProps, mapDispatchToProps)(App);