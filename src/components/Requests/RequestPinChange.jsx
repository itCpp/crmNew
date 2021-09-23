import React from "react";
import axios from "./../../utils/axios-header";

import { Icon, Button, Modal, Header } from "semantic-ui-react";

const RequestPinChange = props => {

    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [load, setLoad] = React.useState(false);

    const [pins, setPins] = React.useState([]);
    const [clear, setClear] = React.useState(false);

    const [select, setSelect] = React.useState(false);

    React.useEffect(() => {

        if (open) {

            setLoad(true);
            setSelect(false);

            axios.post('requests/changePinShow', { id: row.id }).then(({ data }) => {
                setPins(data.pins);
                setClear(data.clear);
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
                user: select
            }).then(({ data }) => {
                props.updateRequestRow(data.request);
                setOpen(false);
            }).catch(error => {
                axios.toast(error, { time: 6000 });
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
                color={row.pin ? "green" : "grey"}
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

            <Modal.Content className="text-center">
                {pins.length
                    ? pins.map(row => <div key={row.pin} title={row.title || null} className="d-inline-block">
                        <Button
                            content={row.pin}
                            className="pin-btn-select"
                            color={row.color || "grey"}
                            disabled={row.disabled || select !== false ? true : false}
                            loading={select === row.id ? true : false}
                            onClick={() => setSelect(row.id)}
                        />
                    </div>)
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

export default RequestPinChange;