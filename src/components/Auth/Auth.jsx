import React from 'react';
import axios from './../../utils/axios-header';
import { connect } from 'react-redux';
import { setLogin, setUserData, setUserPermits, setUserWorkTime } from './../../store/actions';
import Cookies from 'js-cookie';
import { updateToken } from "./../../utils/echo-connect";

import { Input, Button } from 'semantic-ui-react';

import './auth.css';

import AuthSecret from './AuthSecret';
import AuthAdmin from './AuthAdmin';

const auths = JSON.parse(localStorage.getItem('auth_story') || "[]") || [];

function Auth(props) {

    const { setLogin, setUserData, setUserPermits } = props;

    const [loading, setLoading] = React.useState(false);
    const [send, setSend] = React.useState(false);
    const [error, setError] = React.useState(false);

    const [loginName, setLoginName] = React.useState(null);
    const [autoLoginName, setAutoLoginName] = React.useState(null);
    const [userId, setUserId] = React.useState(null);
    const [userName, setUserName] = React.useState(null);
    const [userAuthType, setUserAuthType] = React.useState(null);
    const [authQueryId, setAuthQueryId] = React.useState(null);
    const [ip, setIp] = React.useState(null);

    const loginDone = data => {

        let tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";

        Cookies.set(tokenKey, data.token, {
            domain: process.env.REACT_APP_COOKIE_DOMAIN || window.location.hostname,
        });

        updateToken(data.token);
        localStorage.setItem(tokenKey, data.token);

        [...auths].forEach((row, i) => {
            if (row.pin === data.user.pin) {
                auths.splice(i, 1);
            }
        });

        auths.push({ pin: data.user.pin, name: data.user.name_fio });

        if (auths.length > 5)
            auths.splice(0, auths.length - 5);

        localStorage.setItem('auth_story', JSON.stringify(auths));

        setLogin(true);
        setUserData(data.user);
        setUserPermits(data.permits);
        props.setUserWorkTime(data.worktime);
    }

    React.useEffect(() => {

        if (send && (autoLoginName || loginName)) {

            setLoading(true);

            axios.post('loginStart', {
                login: autoLoginName || loginName,
            }).then(({ data }) => {
                setUserId(data.id);
                setUserName(data.name);
                setUserAuthType(data.auth_type);
                setError(false);
                setAuthQueryId(data.query_id);
                setIp(data.ip);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
                setAutoLoginName(null);
            });

        }

        return setSend(false);

    }, [send]);

    const authCansel = () => {
        setLoginName(null);
        setUserId(null);
        setUserName(null);
        setUserAuthType(null);
    }

    let body = <>
        <Input
            fluid
            placeholder="Введите Ваш pin или логин"
            ref={input => input && input.focus()}
            value={loginName || ""}
            onChange={el => setLoginName(el.currentTarget.value || null)}
            onKeyUp={e => e.keyCode === 13 ? setSend(true) : null}
            disabled={loading}
            name="login"
        />

        {auths && auths.length > 0 && auths.map((row, i) => <Button
            key={`auto_${i}`}
            fluid
            className="my-1"
            content={<div className="d-flex">
                <b>{row.pin}</b>
                <span className="ml-1 flex-grow-1 text-right">{row.name}</span>
            </div>}
            onClick={() => {
                setAutoLoginName(row.pin);
                setSend(true);
            }}
            basic
            disabled={loading}
        />)}

        <Button
            fluid
            className="mt-3"
            content="Продолжить"
            primary
            disabled={!loginName || loading}
            loading={loading}
            onClick={() => setSend(true)}
        />
    </>

    if (userAuthType === "secret") {
        body = <AuthSecret
            loginDone={loginDone}
            setLogin={setLogin}
            userName={userName}
            userId={userId}
            loginName={loginName}
            setError={setError}
            authCansel={authCansel}
        />
    }
    else if (userAuthType === "admin") {
        body = <AuthAdmin
            loginDone={loginDone}
            setLogin={setLogin}
            userName={userName}
            userId={userId}
            authQueryId={authQueryId}
            loginName={loginName}
            setError={setError}
            authCansel={authCansel}
            ip={ip}
        />
    }
    else if (userAuthType !== null) {
        body = <>

            <div className="mb-2 px-1">Здравствуйте, {userName}!</div>

            <div className="text-danger px-1">К сожалению, тип авторизации для Вашей учетной записи не определен, сообщите об этом администратору</div>

            <Button
                fluid
                className="mt-3"
                content="Отмена"
                basic
                disabled={loading}
                onClick={authCansel}
            />

        </>
    }

    return <div className="auth-bg">

        <div className="auth-block">

            <div className="my-3 text-center">
                <h3>CRM MKA</h3>
            </div>

            <div className="auth-block-form">

                <div className="mb-3 text-center">
                    <strong>Авторизация</strong>
                </div>

                {body}

            </div>

            {error
                ? <div className="auth-error">{error}</div>
                : null
            }

        </div>

    </div>

}

const mapStateToProps = state => ({
    login: state.main.login,
});

const mapDispatchToProps = {
    setLogin, setUserData, setUserPermits, setUserWorkTime
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);