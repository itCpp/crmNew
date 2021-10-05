import React from 'react';
import axios from './../../utils/axios-header';

import { Message, Button, Dimmer, Loader } from "semantic-ui-react";

const getTimer = sec => {

    let minuts = Math.floor(sec / 60),
        seconds = sec - (minuts * 60);

    return `${('0' + minuts).slice(-2)}:${('0' + seconds).slice(-2)}`;

}

const AuthAdmin = props => {

    const { authQueryId, userId, authCansel, setError, loginDone } = props;

    const [cancel, setCancel] = React.useState(null);
    const [timer, setTimer] = React.useState(0);
    const foo = React.useRef();

    const [password, setPassword] = React.useState(null);
    const [send, setSend] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {

        if (send && password) {

            setLoading(true);

            axios.post('login', {
                id: props.userId,
                query_id: authQueryId,
                password
            }).then(({ data }) => {
                setError(false);
                loginDone(data);
            }).catch(error => {
                setError(axios.getError(error));
                authCansel();
            }).then(() => {
                setLoading(false);
            });

        }

        return setSend(false);

    }, [send]);

    React.useEffect(() => {

        foo.current = setInterval(() => setTimer(prevTimer => loading ? prevTimer : prevTimer + 1), 1000);

        window.Echo.channel(`App.Auth.${userId}`)
            .listen('AuthDone', e => {

                if (e.done === true) {
                    setPassword(e.data.password);
                    setSend(true);
                }
                else if (e.done === false) {
                    setError("Запрос авторизации отклонен руководителем");
                    authCansel();
                }

            });

        return () => {
            clearInterval(foo.current);
            window.Echo.leaveChannel(`App.Auth.${userId}`);
        }

    }, []);

    React.useEffect(() => {

        if (timer === 600) {
            setError("Время ожидания запроса истекло");
            setCancel(true);
        }

    }, [timer])

    React.useEffect(() => {

        if (cancel) {

            axios.post('loginCancel', {
                query_id: authQueryId,
                user_id: userId
            }).then(() => {
                authCansel();
            }).catch(error => {
                axios.toast(error);
                setCancel(false);
                authCansel();
            });

        }

    }, [cancel]);

    return <div className="position-relative">

        <div className="mb-2 px-1">Здравствуйте, {props.userName}!</div>

        <div className="mb-2 px-1 text-muted"><strong>Пароль вводить не нужно</strong>. Ожидайте одобрения авторизации Вашим руководителем</div>

        <div className="d-flex justify-content-between align-items-center">
            <Button
                className="mt-1"
                content="Отмена"
                basic
                loading={cancel}
                onClick={authCansel}
                icon="chevron left"
                // labelPosition="left"
                onClick={() => setCancel(true)}
            />

            <strong>Ожидание {getTimer(timer)}</strong>

            <Dimmer active={loading} inverted>
                <Loader inverted />
            </Dimmer>

        </div>

        {timer > 120
            ? <Message info content="Если ожидание затянулось, сообщите об этом своему руководителю" />
            : null
        }

    </div>

}

export default AuthAdmin;