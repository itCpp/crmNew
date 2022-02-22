import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSendSms } from "../../../store/requests/actions";
import axios from "./../../../utils/axios-header";

import { Modal, Form, Message, Button, Grid, Header, Icon } from "semantic-ui-react";
import moment from "./../../../utils/moment";

// let timeNow = null;

const RequestSendSms = props => {

    const { sendSms } = useSelector(state => state.requests);
    const dispatch = useDispatch();

    const [load, setLoad] = React.useState(false);
    const [loadMessages, setLoadMessages] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [formdata, setFormdata] = React.useState({});
    const [permits, setPermits] = React.useState({});
    const [phones, setPhones] = React.useState([]);
    const [request, setRequest] = React.useState({});
    const [send, setSend] = React.useState(false);
    const [alert, setAlert] = React.useState(null);

    const [messages, setMessages] = React.useState([]);
    // const interval = React.useRef();

    // const checkUpdateMessages = () => {

    //     axios.post('requests/getSmsUpdates', {
    //         id: sendSms,
    //         time: timeNow,
    //     }).then(({ data }) => {

    //         if (data.messages.length) {
    //             setMessages(prev => {

    //                 prev.forEach((p, i) => {
    //                     data.messages.forEach(row => {
    //                         if (row.id === p.id) {
    //                             prev[i] = row;
    //                         }
    //                     });
    //                 });

    //                 return prev;

    //             });
    //         }
    //     }).catch(() => {
    //         clearInterval(interval.current);
    //     });

    // }

    React.useEffect(() => {

        if (sendSms) {

            setLoad(true);
            setLoadMessages(true);
            setError(false);
            setErrors({});

            // interval.current = setInterval(checkUpdateMessages, 6000);

            axios.post('requests/getSmsData', { id: sendSms }).then(({ data }) => {
                setFormdata({
                    request_id: data.request.id,
                    message: data.message || "",
                    phone: data.phones.length ? data.phones[0].id : null,
                });
                setRequest(data.request);
                setPhones(data.phones);
                setMessages(data.messages);
                setPermits(data.permits);
                setAlert(data.alert);
                // timeNow = data.now;
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoad(false);
                setLoadMessages(false);
            });

        }

        return () => {
            // clearInterval(interval.current);
        }

    }, [sendSms]);

    React.useEffect(() => {

        if (send === true) {

            setLoad(true);

            axios.post('requests/sendSms', formdata).then(({ data }) => {
                dispatch(setSendSms(null));
                // setLoad(false);
                // setMessages(prev => ([data.sms, ...prev]));
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
        closeOnDimmerClick={false}
    >

        <Modal.Header>Сообщения</Modal.Header>

        <Modal.Content className="sms-content">

            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column width={7}>

                        <Header
                            as="h3"
                            content={`Заявка #${sendSms}`}
                            subheader={request.client_name || null}
                        />

                        {!load && !permits?.requests_send_sms && <Message error content="Вы не можете отправлять СМС сообщения" size="mini" />}

                        {!load && error && <Message error content={error} size="mini" />}
                        {!load && alert && <Message info content={alert} size="mini" />}

                        <Form loading={load}>

                            <Form.Select
                                label="Выберите телефон для отправки"
                                placeholder="Выберите телефон"
                                name="phone"
                                value={formdata.phone || ""}
                                onChange={(e, { name, value }) => setFormdata(p => ({ ...p, [name]: value }))}
                                disabled={
                                    (error ? true : false)
                                    || phones.length <= 1
                                    || !permits?.requests_send_sms
                                }
                                options={phones.map((phone, i) => ({
                                    key: i,
                                    text: phone.phone,
                                    value: phone.id,
                                }))}
                                error={errors.phone ? true : false}
                            />

                            <Form.TextArea
                                label="Текст сообщения"
                                placeholder="Введите текст СМС"
                                rows={7}
                                name="message"
                                value={formdata.message || ""}
                                onChange={(e, { name, value }) => setFormdata(p => ({ ...p, [name]: value }))}
                                disabled={
                                    error ? true : false
                                        || !permits?.requests_send_sms
                                        || !permits?.requests_send_sms_no_limit
                                }
                                error={errors.message ? true : false}
                            />

                        </Form>

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
                                || !permits?.requests_send_sms
                            }
                            onClick={() => setSend(true)}
                            fluid
                            className="mt-2"
                        />

                    </Grid.Column>

                    <Grid.Column width={9} className="scrolling-sms d-flex flex-column-reverse">

                        {loadMessages && <div className="loading-messages">Загрузка сообщений...</div>}
                        {!loadMessages && messages.length === 0 && <div className="loading-messages">Сообщений нет</div>}
                        {!loadMessages && messages.map(m => <SmsRow key={m.message_id} row={m} />)}

                    </Grid.Column>

                </Grid.Row>
            </Grid>

        </Modal.Content>

    </Modal>;

}

const SmsRow = props => {

    const { row } = props;

    let className = [`sms-row`, `w-100`, `sms-row-${row.direction}`];

    return <div className={className.join(' ')}>

        {row.created_pin && <span className="sms-title">{row.created_pin}</span>}

        <span className="sms-message">{row.message}</span>

        <span className="sms-date">

            {row.response && (row.response?.Response !== "Success" || row.response?.ResponseCode !== 200) && <span className="text-danger opacity-70">{row.response?.Message || "Ошибка" + (row.response?.ResponseCode ? ` ${row.response.ResponseCode}` : "")}</span>}

            <span className="sms-created-at opacity-70">{moment(row.created_at).format("DD.MM.YYYY HH:mm")}</span>

            {row.response?.Response && row.response.Response === "Success" && <span>
                <Icon name="check" color="green" fitted />
            </span>}

            {row.direction === "out" && !row.response && !row.failed_at && <span>
                <Icon name="wait" color="blue" fitted />
            </span>}

            {row.failed_at && <span>
                <Icon name="warning sign" color="red" fitted />
            </span>}

        </span>

        {/* {row.failed_at && <div className="sms-failed">
            <Icon name="warning sign" />
        </div>} */}

    </div>
}

export default RequestSendSms;