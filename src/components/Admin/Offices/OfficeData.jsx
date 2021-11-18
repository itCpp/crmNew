import React from "react";
import axios from "./../../../utils/axios-header";

import { Icon, Message, Form, Button, Grid, Segment } from "semantic-ui-react";

const OfficeData = props => {

    const { office, setOffices, setOffice } = props;
    const segment = React.useRef();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);

    // React.useEffect(() => {
    //     if (office && segment.current) {
    //         setTimeout(() => {
    //             segment.current.classList.add('slide-out-left');
    //             segment.current.style.display = "block";
    //             setTimeout(() => segment.current.classList.remove('slide-out-left'), 200);
    //         }, 210);
    //     }
    //     else if (segment.current && office === false) {
    //     }
    // }, [office]);

    React.useEffect(() => {

        if (typeof office == "number") {

            setLoading(true);

            axios.post('dev/getOffice', {
                id: office,
                forSetting: true
            }).then(({ data }) => {
                setFormdata(data.office);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [office]);

    const onChange = React.useCallback((e, { name, value, type, checked }) => {

        if (type === "checkbox")
            value = checked ? 1 : 0;

        setFormdata(prev => ({ ...prev, [name]: value }));

    }, []);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('dev/saveOffice', formdata).then(({ data }) => {

                setOffices(prev => {

                    if (formdata.id) {
                        prev.forEach((row, i) => {
                            if (row.id === data.office.id) {
                                prev[i] = { ...row, ...data.office }
                            }
                        });
                    }
                    else {
                        prev.unshift(data.office);
                    }

                    return prev;

                });

            }).catch(e => {
                axios.toast(e);
                setErrors(axios.getErrors(e));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <div className="admin-content-segment" ref={segment}>

        <div className="divider-header">
            <div className="d-flex align-items-center">
                <span>
                    <Icon
                        name="arrow left"
                        className="button-icon mr-3"
                        onClick={() => setOffice(false)}
                        size="large"
                        title="Назад"
                    />
                </span>
                <h3>Настройка офиса{' '}{formdata.name || null}</h3>
            </div>
        </div>

        {error && <Message error content={error} />}

        <Form loading={loading}>

            <Form.Input
                label="Наименование офиса"
                placeholder="Укажите наименование офиса"
                name="name"
                value={formdata.name || ""}
                error={errors.name ? true : false}
                onChange={onChange}
                disabled={!loading && (error ? true : false)}
            />

            <Form.Checkbox
                toggle
                label="Сделать активным в списке адресов для записи клиента"
                name="active"
                checked={formdata.active === 1 ? true : false}
                onChange={onChange}
                disabled={!loading && (error ? true : false)}
            />

            <Form.Input
                label="Короткий адрес"
                placeholder="Нпример: ул. Моховая, д. 1"
                name="addr"
                value={formdata.addr || ""}
                error={errors.addr ? true : false}
                onChange={onChange}
                disabled={!loading && (error ? true : false)}
            />

            <Form.TextArea
                label="Полный адрес"
                placeholder="Укажите полный адрес офиса"
                name="address"
                value={formdata.address || ""}
                error={errors.address ? true : false}
                onChange={onChange}
                disabled={!loading && (error ? true : false)}
            />

            <hr />

            <h4 className="mt-1">Шаблон СМС</h4>

            <Grid columns={2}>
                <Grid.Row stretched>
                    <Grid.Column width={12}>
                        <Form.TextArea
                            placeholder="Введите текст сообщения..."
                            name="sms"
                            value={formdata.sms || ""}
                            error={errors.sms ? true : false}
                            onChange={onChange}
                            disabled={!loading && (error ? true : false)}
                            style={{ height: '100%' }}
                        />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <div className="segment-copy">
                            <div><b>Переменные:</b></div>
                            <div><code>${`{date}`}</code> <small>дата записи</small></div>
                            <div><code>${`{time}`}</code> <small>время записи</small></div>
                            <div><code>${`{pin}`}</code> <small>оператор</small></div>
                            <div><code>${`{id}`}</code> <small>номер заявки</small></div>
                            <div><code>${`{tel}`}</code> <small>номер секретаря</small></div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Form>

        <div className="text-center mt-3">
            <Button
                color="green"
                content="Сохранить"
                icon="save"
                labelPosition="right"
                disabled={loading || error}
                onClick={() => setSave(true)}
            />
        </div>

    </div>

}

export default OfficeData;