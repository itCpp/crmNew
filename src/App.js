import React from 'react';
import axios from './utils/axios-header';
import connectEcho from "./utils/echo-connect";

import { connect } from 'react-redux';
import {
    setLogin,
    setUserData,
    setUserPermits,
    setAuthQueriesCount,
    setUsersOnline,
    userJoin,
    userLeave,
} from './store/actions';

import { Loader } from 'semantic-ui-react';
import { SemanticToastContainer } from 'react-semantic-toasts';

import './App.css';

import Routes from './components/Routes';

function App(props) {

    const { userData, setLogin, setUserData, setUserPermits } = props;
    const [loading, setLoading] = React.useState(true);

    React.useEffect(async () => {

        await connectEcho();

        await axios.post('/check').then(async ({ data }) => {

            setLogin(true);
            setUserData(data.user);
            setUserPermits(data.permits);
            props.setAuthQueriesCount(data.authQueries);

        }).catch(async error => {

            if (error?.response?.status === 401)
                setLogin(false);

        }).then(async () => {
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {

        if (userData?.id) {

            window.userId = userData.id;
            window.userPin = userData.pin;

            window.Echo && window.Echo.join(`App.Users`)
                .here(props.setUsersOnline)
                .joining(props.userJoin)
                .leaving(props.userLeave);

            window.Echo && window.Echo.private(`App.User.${window.userId}`);

        }
        else if (!userData?.id) {
            window.Echo && window.Echo.leave(`App.Users`);
        }
        else if (!userData?.id && window.userId) {
            window.Echo && window.Echo.leave(`App.User.${window.userId}`);
        }

        return () => {

            window.Echo && window.Echo.leave(`App.Users`);

            if (window.userId)
                window.Echo && window.Echo.leave(`App.User.${window.userId}`);

        }

    }, [userData]);

    if (loading) {
        return <div className="loading-page">
            <Loader active inline="centered" />
        </div>
    }

    return <>
        <SemanticToastContainer position="bottom-left" />
        <Routes {...props} />
    </>

}

const mapStateToProps = state => ({
    login: state.main.login,
    userData: state.main.userData,
});

const mapDispatchToProps = {
    setLogin,
    setUserData,
    setUserPermits,
    setAuthQueriesCount,
    setUsersOnline,
    userJoin,
    userLeave,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);