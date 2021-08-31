import React from 'react';
import axios from './../../utils/axios-header';
import { connect } from 'react-redux';
import { setLogin, setUserData, setUserPermits } from './../../store/actions';
import Cookies from 'js-cookie';

import { Input, Button } from 'semantic-ui-react';

import './auth.css';

import AuthSecret from './AuthSecret';

function Auth(props) {

    const { setLogin, setUserData, setUserPermits } = props;

    const [loginName, setLoginName] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [send, setSend] = React.useState(false);
    const [error, setError] = React.useState(false);

    const [userId, setUserId] = React.useState(null);
    const [userName, setUserName] = React.useState(null);
    const [userAuthType, setUserAuthType] = React.useState(null);

    const loginDone = data => {

        setLogin(true);
        setUserData(data.user);
        setUserPermits(data.permits);

        let tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";

        Cookies.set(tokenKey, data.token, {
            domain: process.env.REACT_APP_COOKIE_DOMAIN || window.location.hostname,
        });

        localStorage.setItem(tokenKey, data.token);

    }

    React.useEffect(() => {

        if (send && loginName) {

            setLoading(true);

            axios.post('loginStart', {
                login: loginName
            }).then(({ data }) => {
                setUserId(data.id);
                setUserName(data.name);
                setUserAuthType(data.auth_type);
                setError(false);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

        return setSend(false);

    }, [send]);

    let body = <>
        <Input
            fluid
            placeholder="Введите Ваш pin или логин"
            ref={input => input && input.focus()}
            onChange={el => setLoginName(el.currentTarget.value || null)}
            onKeyUp={e => e.keyCode === 13 ? setSend(true) : null}
            disabled={loading}
            name="login"
        />

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

    if (userAuthType === "secret")
        body = <AuthSecret
            loginDone={loginDone}
            setLogin={setLogin}
            userName={userName}
            userId={userId}
            loginName={loginName}
            setError={setError}
        />

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
    setLogin, setUserData, setUserPermits
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);