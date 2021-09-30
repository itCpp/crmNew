import React from 'react';
import axios from './../../utils/axios-header';

import { Message, Button } from "semantic-ui-react";

const getTimer = sec => {

    let minuts = Math.floor(sec / 60),
        seconds = sec - (minuts * 60);

    return `${('0' + minuts).slice(-2)}:${('0' + seconds).slice(-2)}`;

}


const AuthAdmin = props => {

    const { authQueryId, userId, authCansel } = props;

    const [cancel, setCancel] = React.useState(null);
    const [timer, setTimer] = React.useState(0);
    const foo = React.useRef();

    React.useEffect(() => {

        foo.current = setInterval(() => setTimer(prevTimer => prevTimer + 1), 1000);

        return () => clearInterval(foo.current);

    }, []);

    React.useEffect(() => {

        if (timer === 600) {
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

    return <>

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
                labelPosition="left"
                onClick={() => setCancel(true)}
            />

            <strong>{getTimer(timer)}</strong>

        </div>

        {timer > 120
            ? <Message info content="Если ожидание затянулось, сообщите об этом своему руководителю" />
            : null
        }

    </>

}

export default AuthAdmin;