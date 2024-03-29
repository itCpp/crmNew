import React from 'react';
import axios from './../../utils/axios-header';

import { Input, Button, Icon } from 'semantic-ui-react';

function AuthSecret(props) {

    const { setError, loginDone, authCansel } = props;

    const [password, setPassword] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [send, setSend] = React.useState(false);

    const [showPass, setShowPass] = React.useState(false);

    const timeout = React.useRef();

    React.useEffect(() => {
        timeout.current = setTimeout(authCansel, 90000);
        return () => {
            setPassword(null);
            clearTimeout(timeout.current);
        }
    }, []);

    React.useEffect(() => {

        if (send && password) {

            setLoading(true);

            axios.post('login', {
                id: props.userId,
                password
            }).then(({ data }) => {
                setError(false);
                loginDone(data);
            }).catch(error => {
                setError(axios.getError(error));
                setLoading(false);
            });

        }

        return setSend(false);

    }, [send]);

    return <>

        <div className="mb-2 px-1">Здравствуйте, {props.userName}!</div>

        <input type="hidden" name="login" value={props.loginName || ""} />

        <Input
            fluid
            placeholder="Введите пароль..."
            type={showPass ? "text" : "password"}
            ref={input => input && input.focus()}
            onChange={el => setPassword(el.currentTarget.value || null)}
            value={password || ""}
            onKeyUp={e => e.keyCode === 13 ? setSend(true) : null}
            disabled={loading}
            icon={<Icon
                name={showPass ? "eye" : "eye slash"}
                link
                onClick={() => setShowPass(!showPass)}
            />}
        />

        <Button
            fluid
            className="mt-3"
            content="Войти"
            primary
            disabled={!password || loading}
            loading={loading}
            onClick={() => setSend(true)}
        />

        <Button
            fluid
            className="mt-1"
            content="Отмена"
            basic
            disabled={loading}
            onClick={() => authCansel(null)}
        />
    </>

}

export default AuthSecret;