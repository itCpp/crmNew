import React from 'react'
import axios from './../../../utils/axios'

import {
    Modal,
    Button,
    Message,
    Icon,
    Form,
    Input,
    Select
} from 'semantic-ui-react';

export default function TabAdd(props) {

    const [open, setOpen] = React.useState(false);

    const [loading, setLoading] = React.useState(false);
    const [save, setSave] = React.useState(false);

    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [formdata, setData] = React.useState({});

    const changeData = (e, option) => {

        let name = e.currentTarget.name || option.name;
        let value = e.currentTarget.value || option.value;

        let changed = Object.assign({}, formdata);

        changed[name] = value;
        setData(changed);

    }

    React.useEffect(() => {

        if (open) {
            setLoading(false);
            setErrors({});
            setError(false);
            setData({});
        }

    }, [open]);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('admin/createAdTab', formdata).then(({ data }) => {

                setErrors({});
                setError(false);

                if (props.site === formdata.site)
                    props.setTabs(data.tabs);

                setOpen(false);
                props.setSites(data.sites);

            }).catch(error => {
                setErrors(axios.getErrors(error));
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <>

        <Modal
            open={open}
            centered={false}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            size="tiny"
            closeOnDimmerClick={false}
            trigger={<Button icon fluid size="mini" labelPosition="right" color="green" className="mb-3">
                Создать плашку <Icon name="plus" />
            </Button>}
        >

            <Modal.Header>Создание новой плашки</Modal.Header>

            <Modal.Content>

                <Form
                    loading={loading}
                >
                    <Form.Field
                        control={Input}
                        label="Адрес сайта *"
                        placeholder="Введите адрес сайта"
                        name="site"
                        value={formdata.site || ""}
                        onChange={changeData}
                        error={errors.site || false}
                    />
                    <Form.Field
                        control={Input}
                        label="Идентификатор компании *"
                        placeholder="utm_campaing"
                        name="compain_id"
                        value={formdata.compain_id || ""}
                        onChange={changeData}
                        error={errors.compain_id || false}
                    />
                    <Form.Field
                        control={Input}
                        label="Наименование для кнопки"
                        placeholder="Наименоваие для кнопки в списке плашек"
                        name="name"
                        value={formdata.name || ""}
                        onChange={changeData}
                        error={errors.name || false}
                    />
                    <Form.Field
                        control={Select}
                        label="Реламная площадка *"
                        options={[
                            {
                                key: 0,
                                text: "Яндекс",
                                value: "yandex",
                                name: "type",
                                onClick: (e, data) => changeData(e, data)
                            },
                            {
                                key: 1,
                                text: "Google",
                                value: "google",
                                name: "type",
                                onClick: (e, data) => changeData(e, data)
                            },
                        ]}
                        placeholder="Выберите площадку"
                        value={formdata.type || ""}
                        error={errors.type || false}
                    />
                </Form>

                {!Object.keys(errors).length && error ? <Message negative>{error}</Message> : null }

            </Modal.Content>

            <Modal.Actions>

                <Button
                    onClick={() => setOpen(false)}
                    content="Отмена"
                />

                <Button
                    onClick={() => setSave(true)}
                    color="green"
                    disabled={loading}
                    icon
                    labelPosition="right"
                >
                    Создать <Icon name="save" />
                </Button>

            </Modal.Actions>

        </Modal>

    </>

}