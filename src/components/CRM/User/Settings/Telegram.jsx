import React from "react";
import { Button, Dimmer, Icon, Loader, Modal } from "semantic-ui-react";
import { axios } from "../../../../utils";

const Telegram = props => {

    const { user, setUser } = props;
    const { pin } = user;

    React.useEffect(() => {

        window.Echo && window.Echo.private('App.User.Pin.' + pin)
            .listen('Users\\TelegramBinded', ({ telegram_id }) => {
                setUser({ ...user, telegram_id })
            });

        return () => {
            window.Echo && window.Echo.private('App.User.Pin.' + pin)
                .stopListening('Users\\TelegramBinded');
        }

    }, [user]);

    return <div className="block-card mb-3">

        <div className="d-flex align-items-center">

            <div className="d-flex align-items-center flex-grow-1">
                <Icon name="telegram" color="blue" size="large" />
                <h5 className="my-0">Telegram ID</h5>
            </div>

            {!Boolean(user?.telegram_id)
                ? <TelegramBind {...props} />
                : <div style={{ fontFamily: "monospace" }}>
                    <b>{user.telegram_id}</b>
                    <Icon name="check" color="green" className="ml-2 mr-0" />
                </div>
            }

        </div>

    </div>
}

const TelegramBind = props => {

    const [show, setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [code, setCode] = React.useState(null);

    React.useEffect(() => {

        if (show) {

            setLoading(true);

            axios.post('users/setting/telegram/bind/create').then(({ data }) => {
                setCode(data.code);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
        }

    }, [show]);

    return <Modal
        open={show}
        basic
        onClose={() => setShow(false)}
        size="mini"
        centered={false}
        closeIcon={!loading}
        trigger={<Button
            size="mini"
            className="m-0 px-3 py-2"
            content="Привязать"
            color="green"
            icon="plus"
            labelPosition="right"
            onClick={() => setShow(p => !p)}
        />}
        content={<div className="content text-center">

            <Icon name="telegram" size="huge" fitted />

            {!loading && <div className="mt-4">

                {error && <div className="text-danger"><b>Ошибка:</b> {error}</div>}

                {!error && <div>
                    <div>Чтобы привязать идентификатор Телеграма, необходимо запустить бота <a href="https://t.me/crmmkabot" terget="_blank">@crmmkabot</a> и отправить ему сообщение</div>

                    <h2 style={{ fontFamily: "monospace" }}>/bind {code}</h2>

                </div>}

            </div>}

            <Dimmer active={loading}>
                <Loader />
            </Dimmer>

        </div>}
    />

}

export default Telegram;