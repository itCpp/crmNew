import React from 'react';
import axios from './utils/axios-header';
import connectEcho from "./utils/echo-connect";
import Cookies from 'js-cookie';
import { updateToken } from './utils/echo-connect';
import { connect } from 'react-redux';
import {
    setLogin,
    setUserData,
    setUserPermits,
    setAuthQueriesCount,
    setUsersOnline,
    userJoin,
    userLeave,
    setUserWorkTime,
} from './store/actions';
import { Loader } from 'semantic-ui-react';
import { SemanticToastContainer } from 'react-semantic-toasts';
import './App.css';
import "./components/CRM/Requests/requests.css";
import Routes from './components/Routes';
import { TESTING_URL } from "./components/Testing";

const appUserEvent = data => {

    if (data.alert)
        axios.toast(null, data.alert);

}

const appUserPinEvent = data => {

    if (typeof data.toast == "object") {
        axios.toast(null, data.toast);
    } else if (data?.type === "auto_change_count") {
        axios.toast(null, {
            time: 30000,
            type: "info",
            title: "Смена статуса",
            description: data.message,
        });
    }

}

/**
 * Расшифровывет данные пользователя в Bearer токене
 * @param {string} token JWT token
 * @param {null|string} type 
 * @returns {any}
 */
export const dataFromJwt = (token, type = null) => {

    let jwt = String(token).split(".");

    if (typeof jwt[1] == "undefined") return null;

    let payload = Buffer.from(jwt[1], 'base64').toString('utf-8');
    let user = JSON.parse(payload);

    if (typeof user != "object") return null;

    if (Boolean(type) && user[type]) return user[type];

    return user;
}

function App(props) {

    const searchParams = new URLSearchParams(window.location.search);

    const { userData, setLogin, setUserData, setUserPermits } = props;
    const [loading, setLoading] = React.useState(true);
    const [globalError, setGlobalError] = React.useState(null);

    React.useEffect(async () => {

        if (window.location.pathname.indexOf(TESTING_URL) >= 0) {
            setLogin(true);
            setLoading(false);

            return null;
        }

        await connectEcho();

        let config = {};
        if (searchParams.get('token'))
            config.headers = { 'X-Automatic-Auth': searchParams.get('token') };

        await axios.post('/check', {}, config).then(async ({ data }) => {

            if (data.token) {

                let tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";

                Cookies.set(tokenKey, data.token, {
                    domain: process.env.REACT_APP_COOKIE_DOMAIN || window.location.hostname,
                });

                updateToken(data.token);
                localStorage.setItem(tokenKey, data.token);
            }

            setLogin(true);
            setUserData(data.user);
            setUserPermits(data.permits);
            props.setAuthQueriesCount(data.authQueries);
            props.setUserWorkTime(data.worktime);

            window.permits = { ...window.permits, ...data.permits }

        }).catch(async error => {

            if (error?.response?.status === 401)
                setLogin(false);
            else
                setGlobalError(error);

        }).then(async () => {
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {

        window.Echo && window.Echo.channel(`App.Alerts`)
            .listen('Users\\MailListEvent', appUserPinEvent);

        if (userData?.id) {

            window.userId = userData.id;
            window.userPin = userData.pin;

            window.Echo && window.Echo.join(`App.Users`)
                .here(props.setUsersOnline)
                .joining(props.userJoin)
                .leaving(props.userLeave);

            window.Echo && window.Echo.private(`App.User.${window.userId}`)
                .listen('Users\\ChangeUserWorkTime', data => {
                    console.log(data);
                    props.setUserWorkTime(data.worktime);
                })
                .listen('AppUserEvent', appUserEvent)
                .listen('Users\\CloseSession', ({ user_token }) => {

                    let tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";
                    const token = Cookies.get(tokenKey) || localStorage.getItem(tokenKey);

                    if (token === user_token || dataFromJwt(token, "token") === user_token) {

                        axios.toast("Ваша сессия завершена", {
                            title: "Внимание",
                            icon: "log out",
                        });

                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    }
                });

            window.Echo && window.Echo.private(`App.User.Pin.${window.userPin}`)
                .listen('AppUserPinEvent', appUserPinEvent);

        }
        else if (!userData?.id) {
            window.Echo && window.Echo.leave(`App.Users`);
        }
        else if (!userData?.id && window.userId) {
            window.Echo && window.Echo.leave(`App.User.${window.userId}`);
        }

        return () => {

            window.Echo && window.Echo.leave(`App.Alerts`);

            window.Echo && window.Echo.leave(`App.Users`);

            if (window.userId)
                window.Echo && window.Echo.leave(`App.User.${window.userId}`);

            if (window.userPin)
                window.Echo && window.Echo.leave(`App.User.Pin.${window.userPin}`);

        }

    }, [userData]);

    if (loading) {
        return <div className="loading-page">
            <div>
                <Loader active inline="centered" />
                {searchParams.get('token') && <div className="opacity-50">Проверка авторизации...</div>}
            </div>
        </div>
    }

    return <>
        <SemanticToastContainer position="bottom-right" />
        <Routes
            {...props}
            globalError={globalError}
            hidden={window.location.pathname.indexOf(TESTING_URL) >= 0}
        />
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
    setUserWorkTime,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);