import React from "react";
import axios from "./../../../../utils/axios-header";
import { connect } from 'react-redux';
import { updateRequestRow } from "./../../../../store/requests/actions";
import { Icon, Button, Modal, Header, Select, Label } from "semantic-ui-react";

const RequestChangePin = props => {

    const { row, onlineId } = props;
    const [open, setOpen] = React.useState(false);
    const [load, setLoad] = React.useState(false);

    const [pins, setPins] = React.useState([]);
    const [clear, setClear] = React.useState(false);

    const [select, setSelect] = React.useState(false);

    const [addrs, setAddrs] = React.useState([]);
    const [addr, setAddr] = React.useState(null);

    const [errors, setErrors] = React.useState({});

    const [flash, setFlash] = React.useState(false);
    const flashInterval = React.useRef();

    const handleFlash = React.useCallback(() => {
        setFlash(f => !f);
    }, []);

    React.useEffect(() => {

        if (row.status_null_flash) {
            flashInterval.current = setInterval(handleFlash, 1000);
        }

        return () => {
            flashInterval.current && clearInterval(flashInterval.current);
        }

    }, [row?.status_null_flash])

    React.useEffect(() => {

        if (open) {

            setLoad(true);
            setSelect(false);
            setErrors({});

            axios.post('requests/changePinShow', { id: row.id }).then(({ data }) => {

                setPins(data.pins);
                setClear(data.clear);

                setAddrs(data.offices);
                setAddr(data.address);

            }).catch(error => {
                axios.toast(error, { time: 6000 });
                setOpen(false);
            }).then(() => {
                setLoad(false);
            });

        }

    }, [open]);

    React.useEffect(() => {

        if (select !== false) {

            axios.post('requests/setPin', {
                id: row.id,
                user: select,
                addr,
            }).then(({ data }) => {
                props.updateRequestRow(data.request);
                setOpen(false);
                setErrors({});
            }).catch(error => {
                axios.toast(error, { time: 6000 });
                setErrors(axios.getErrors(error));
            }).then(() => {
                setSelect(false);
            });

        }

    }, [select]);

    if ((row.permits.requests_pin_set && !row.pin) || row.permits.requests_pin_change) {

        return <Modal
            basic
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open && !load}
            size='small'
            trigger={<Button
                icon={row.pin ? "user" : "user plus"}
                content={row.pin}
                color={row.pin ? "green" : (flash ? "red" : null)}
                title={row.pin ? "Сменить оператора" : "Назначить оператора"}
                size="mini"
                className="p-2"
                loading={load}
            />}
        >

            <Header icon>
                <Icon name={row.pin ? "users" : "user plus"} />
                <span>{row.pin ? "Сменить оператора" : "Назначить оператора"}</span>
            </Header>

            <Modal.Content className="text-center pt-0">

                <div>
                    <Select
                        basic
                        options={[{ name: "Не указан", id: null }, ...addrs].map(item => ({
                            key: item.id,
                            text: item.name,
                            value: item.id,
                            disabled: item.active === 0 ? true : false,
                            onClick: () => setAddr(item.id),
                        }))}
                        placeholder="Укажите адрес"
                        className="mb-3"
                        value={addr}
                        disabled={select !== false ? true : false}
                        error={errors.addr ? true : false}
                    />
                </div>

                {pins.length
                    ? pins.map(user => {

                        let className = ["pin-btn-select"];

                        if (!user.active_at && onlineId.indexOf(user.id) < 0 && user.color !== "blue")
                            user.color = "grey";

                        return <div key={user.pin} title={user.title || null} className="d-inline-block position-relative">

                            <Button
                                content={<div>
                                    <div>{user.pin}</div>
                                    <div title="Заявок/Приходов КПД%" style={{
                                        fontWeight: 100,
                                        fontSize: "70%",
                                        lineHeight: "70%",
                                        marginTop: "0.2rem",
                                        opacity: "0.8",
                                    }}>
                                        <span>
                                            {user.rating
                                                ? <>
                                                    {user.rating?.requestsAll || 0}
                                                    {'/'}
                                                    {user.rating?.comings || 0}
                                                    {' '}
                                                    {Number(user.rating?.efficiency || 0).toFixed(0)}%
                                                </>
                                                : <span className="opacity-40">- - - - -</span>
                                            }
                                        </span>
                                    </div>
                                </div>}
                                className={className.join(' ')}
                                color={user.color || "grey"}
                                disabled={user.disabled || select !== false ? true : false}
                                loading={select === user.id ? true : false}
                                onClick={() => setSelect(user.id)}
                                title={user.fio}
                            />

                            {onlineId && onlineId.indexOf(user.id) >= 0 &&
                                <Label
                                    circular
                                    color={user.color === "green" ? "red" : "green"}
                                    empty
                                    attached="bottom right"
                                    style={{ bottom: "2px", right: "2px" }}
                                    size="mini"
                                    title="Онлайн"
                                />
                            }

                        </div>
                    })
                    : <div className="text-muted">Доступных к выбору операторов нет</div>
                }
            </Modal.Content>

            <Modal.Actions className="text-center">
                <Button
                    basic
                    inverted
                    onClick={() => setOpen(false)}
                    content="Отмена"
                    className="mx-1"
                />
                {clear && row.pin
                    ? <Button
                        basic
                        inverted
                        icon="user remove"
                        color="red"
                        onClick={() => setSelect(null)}
                        content="Очистить"
                        className="mx-1"
                        loading={select === null ? true : false}
                    />
                    : null
                }
            </Modal.Actions>
        </Modal>

    }

    return <div title={row.pin ? "Оператор назначен" : "Оператор не назначен"}>
        <Icon name="user" />{row.pin || "*****"}
    </div>

}

const mapStateToProps = state => ({
    onlineId: state.main.onlineId,
});

const mpaActionsToProps = {
    updateRequestRow
}

export default connect(mapStateToProps, mpaActionsToProps)(RequestChangePin);