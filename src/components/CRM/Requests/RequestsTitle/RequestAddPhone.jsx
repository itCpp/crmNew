import React from "react";
import axios from "./../../../../utils/axios-header";
import { useDispatch, useSelector } from "react-redux";
import { setAddPhoneShow, updateClientsRequestRow } from "../../../../store/requests/actions";
import { Modal, Form, Button, List, Icon, Message, Checkbox } from "semantic-ui-react";

const RequestAddPhone = props => {

    const { addPhoneShow } = useSelector(state => state.requests);
    const dispatch = useDispatch();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [request, setRequest] = React.useState(null);
    const [clients, setClients] = React.useState([]);
    const [phone, setPhone] = React.useState(null);

    const [checkPhone, setCheckPhone] = React.useState(false);
    const [select, setSelect] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    const clear = React.useCallback(() => {
        setLoading(true);
        setError(false);
        setRequest(null);
        setClients([]);
        setPhone(null);
        setRows([]);
        setSelect(null);
    }, []);

    React.useEffect(() => {

        if (addPhoneShow) {

            setLoading(true);

            axios.post('requests/getRow', {
                id: addPhoneShow
            }).then(({ data }) => {
                setRequest(data.request);
                setClients(data?.request?.clients || []);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }
        else {
            clear();
        }

    }, [addPhoneShow]);

    React.useEffect(() => {

        if (checkPhone) {

            setLoading(true);

            axios.post('requests/addClientPhone', {
                id: addPhoneShow,
                phone,
                select
            }).then(({ data }) => {

                if (data.warning === true) {
                    setRows(data.requests);
                    setSelect(addPhoneShow);
                    return;
                }

                setTimeout(() => {
                    dispatch(updateClientsRequestRow({
                        id: addPhoneShow,
                        clients: data.clients,
                    }));
                }, 100);

                dispatch(setAddPhoneShow(null));
                axios.toast(data.message || "Запрос успешно выполнен", { type: "success" });

            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setCheckPhone(false);

    }, [checkPhone]);

    return <Modal
        open={addPhoneShow ? true : false}
        centered={false}
        size="tiny"
        closeIcon
        onClose={() => dispatch(setAddPhoneShow(null))}
    >

        <Modal.Header>Добавить номер телефона</Modal.Header>

        <Modal.Content>

            {request && <h3>Заявка #{request.id}</h3>}

            {rows.length
                ? <div>

                    <Message warning content={`У клиента с номером телефона ${phone} уже имеется заявка с таким же источником. Чтобы продолжить выберите заявку, которая будет основной, остальные заявки будут удалены`} />

                    <Form loading={loading}>
                        {[{ ...request, this: true }, ...rows].map(row => <Form.Field key={`rows_${row.id}`}>
                            <div className="d-flex align-items-center">
                                <Checkbox
                                    radio
                                    name="selectUnion"
                                    checked={select === row.id}
                                    onChange={() => setSelect(row.id)}
                                />
                                <div className="ml-2" onClick={() => setSelect(row.id)}>
                                    <span>Заявка #{row.id}</span>
                                    {row.status && <strong>{' '}{row.status.name || "Не обработана"}</strong>}
                                    {row.this === true && <span>{' - '}Текущая заявка</span>}
                                </div>
                            </div>
                        </Form.Field>)}
                    </Form>

                </div>
                : <Form loading={loading}>

                    {clients && clients.length > 0 && <List>
                        {clients.map(client => <List.Item key={client.id}>
                            <span>
                                <Icon name="phone" color={phone === client.phone ? "red" : "green"} />
                                <span>{client.phone}</span>
                            </span>
                        </List.Item>)}
                    </List>}

                    <Form.Input
                        label="Новый номер телефона"
                        placeholder="Введите номер телеофна..."
                        value={phone || ""}
                        onChange={(e, { value }) => setPhone(value === "" ? null : value)}
                    />

                </Form>
            }

            {error && <div className="mt-3"><strong className="text-danger">Ошибка: {error}</strong></div>}

        </Modal.Content>
        <Modal.Actions>
            <Button
                color="grey"
                onClick={() => dispatch(setAddPhoneShow(null))}
                content="Отмена"
            />
            <Button
                positive
                onClick={() => setCheckPhone(true)}
                content="Продолжить"
                disabled={loading || phone === null}
            />
        </Modal.Actions>

    </Modal>

}

export default RequestAddPhone;