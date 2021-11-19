import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSendSms } from "../../../store/requests/actions";
import axios from "./../../../utils/axios-header";

import { Modal, Form, Message, Button } from "semantic-ui-react";

const RequestSendSms = props => {

    const { sendSms } = useSelector(state => state.requests);
    const dispatch = useDispatch();

    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [formdata, setFormdata] = React.useState({});
    const [phones, setPhones] = React.useState([]);
    const [request, setRequest] = React.useState({});
    const [send, setSend] = React.useState(false);

    React.useEffect(() => {

        if (sendSms) {

            setLoad(true);
            setError(false);
            setErrors({});

            axios.post('requests/getSmsData', { id: sendSms }).then(({ data }) => {
                setFormdata({
                    request_id: data.request.id,
                    message: data.message || "",
                    phone: data.phones.length ? data.phones[0].id : null,
                });
                setRequest(data.request);
                setPhones(data.phones);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoad(false);
            });

        }

    }, [sendSms]);

    React.useEffect(() => {

        if (send === true) {

            setLoad(true);

            axios.post('requests/sendSms', formdata).then(() => {
                dispatch(setSendSms(null));
            }).catch(e => {
                axios.toast(e);
                setErrors(axios.getErrors(e));
                setLoad(false);
            });

        }

        return () => setSend(false);

    }, [send]);

    return <Modal
        open={sendSms ? true : false}
        centered={false}
        onClose={() => dispatch(setSendSms(null))}
        closeIcon
        size="tiny"
    >

        <Modal.Header>Отправить смс #{sendSms}</Modal.Header>

        <Modal.Content>

            {error && <Message error content={error} />}

            {request?.client_name && <h3>{request.client_name}</h3>}

            <Form loading={load}>

                {phones && phones.length > 0 && <Form.Select
                    label="Выберите телефон для отправки"
                    placeholder="Выберите телефон"
                    name="phone"
                    value={formdata.phone || ""}
                    onChange={(e, { name, value }) => setFormdata(p => ({ ...p, [name]: value }))}
                    disabled={error ? true : false}
                    options={phones.map((phone, i) => ({
                        key: i,
                        text: phone.phone,
                        value: phone.id,
                    }))}
                    error={errors.phone ? true : false}
                />}

                <Form.TextArea
                    label="Текст сообщения"
                    placeholder="Введите текст СМС"
                    rows={5}
                    name="message"
                    value={formdata.message || ""}
                    onChange={(e, { name, value }) => setFormdata(p => ({ ...p, [name]: value }))}
                    disabled={error ? true : false}
                    error={errors.message ? true : false}
                />

            </Form>

        </Modal.Content>

        <Modal.Actions>
            <Button
                icon="send"
                labelPosition="right"
                content="Отправить"
                color="green"
                disabled={
                    load
                    || (error ? true : false)
                    || (!formdata?.message)
                    || (formdata?.message && formdata.message.length === 0)
                }
                onClick={() => setSend(true)}
            />
        </Modal.Actions>

    </Modal>;

}

export default RequestSendSms;