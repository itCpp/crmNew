import React from 'react'
import axios from './../../../utils/axios'

import {
    Modal,
    Button,
    Message,
    Icon,
    Form,
    Input,
    Select,
    Dimmer,
    Loader
} from 'semantic-ui-react';

export default function TabAdd(props) {

    const [open, setOpen] = React.useState(false);

    const [loading, setLoading] = React.useState(false);
    const [loadingData, setLoadingData] = React.useState(false);
    const [save, setSave] = React.useState(false);

    const [error, setError] = React.useState(false);
    const [errorData, setErrorData] = React.useState(false);
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
            setPhones([]);
            setErrorData(false);
            setLoadingPhone(false);
        }

    }, [open]);

    const edit = props.editTab;

    React.useEffect(() => {

        if (edit) {

            setOpen(true);
            setLoadingData(true);

            axios.post('admin/getAdTab', { edit }).then(({ data }) => {
                setData(data.tab);
                setPhones(data.phones);
            }).catch(error => {
                setErrorData(axios.getError(error));
            }).then(() => {
                setLoadingData(false);
            });

        }

    }, [edit]);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            formdata.phones = phones;

            axios.post('admin/createAdTab', formdata).then(({ data }) => {

                setErrors({});
                setError(false);

                if (props.site === formdata.site)
                    props.setTabs(data.tabs);

                setOpen(false);
                props.setSites(data.sites);
                props.setEditTab(null);

            }).catch(error => {
                setErrors(axios.getErrors(error));
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    /** Телефонные номера */
    const [phones, setPhones] = React.useState([]);

    /** Добавление строки с номером телефона */
    const addRowPhone = () => {

        let newPhones = phones.slice();
        newPhones.push({
            value: "",
        });
        setPhones(newPhones);

    }

    /** Удаление строки с номером телефона */
    const removeRowPhone = async (i, rowPhone = null) => {

        let newPhones = [];

        for (let key in phones) {

            if (Number(key) !== Number(i)) {
                newPhones.push(phones[key]);
            }

            if (rowPhone !== null && Number(key) === Number(i)) {

                let deleted = await removePhone(rowPhone);

                if (!deleted)
                    newPhones.push({ ...phones[key], error: true });

            }

        }

        setPhones(newPhones);

    }

    const [loadingPhone, setLoadingPhone] = React.useState(false);

    /** Запрос на удаление номера телефона */
    const removePhone = async rowPhone => {

        let deleted = false;
        setLoadingPhone(true);

        await axios.post('admin/removePhone', rowPhone).then(() => {
            deleted = true;
        }).catch(() => {
            deleted = false;
        }).then(() => {
            setLoadingPhone(false);
        });

        return deleted;

    }

    /** Список номеров телефонов */
    const phonesList = phones.map((phone, i) => <Input
        key={i}
        action={{
            color: "red",
            icon: "trash",
            onClick: () => removeRowPhone(i, phone.id ? phone : null)
        }}
        fluid
        placeholder="Введите номер телефона"
        onChange={e => changePhoneData(e, i)}
        value={phone.value || ""}
        className="my-1"
        error={phone.error ? true : false}
    />);

    /** Изменение поля с номером телефона */
    const changePhoneData = (e, i) => {

        let value = e.currentTarget.value;
        let newPhones = phones.slice();

        newPhones[i].value = value;
        setPhones(newPhones);

    }

    return <>

        <Modal
            open={open}
            centered={false}
            onClose={() => {
                setOpen(false);
                props.setEditTab(false);
            }}
            onOpen={() => setOpen(true)}
            size="tiny"
            closeOnDimmerClick={false}
            trigger={<Button icon fluid size="mini" labelPosition="right" color="green" className="mb-3">
                Создать плашку <Icon name="plus" />
            </Button>}
        >

            <Modal.Header>{edit ? 'Изменение плашки' : 'Создание новой плашки'}</Modal.Header>

            <Modal.Content>

                <Form
                    loading={loading || loadingData}
                >
                    <Form.Field
                        control={() => <Input
                            label="https://"
                            placeholder="Введите адрес сайта"
                            name="site"
                            value={formdata.site || ""}
                            onChange={changeData}
                            disabled={errorData ? true : false}
                        />}
                        label="Адрес сайта *"
                        placeholder="Введите адрес сайта"
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
                        disabled={errorData ? true : false}
                    />
                    <Form.Field
                        control={Input}
                        label="Наименование для кнопки"
                        placeholder="Наименоваие для кнопки в списке плашек"
                        name="name"
                        value={formdata.name || ""}
                        onChange={changeData}
                        error={errors.name || false}
                        disabled={errorData ? true : false}
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
                        disabled={errorData ? true : false}
                    />

                    <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                        <h3 className="my-0">Номера телефонов</h3>
                        <Button
                            icon="plus"
                            size="mini"
                            primary
                            onClick={addRowPhone}
                            totle="Доабавить строку с телефоном"
                            disabled={errorData ? true : false}
                        />
                    </div>

                    <div className="position-relative">
                        {phonesList}
                        {loadingPhone ? <Dimmer active inverted>
                            <Loader />
                        </Dimmer> : null}
                    </div>

                </Form>

                {errorData ? <Message negative>{errorData}</Message> : null}
                {!Object.keys(errors).length && error ? <Message negative>{error}</Message> : null}

            </Modal.Content>

            <Modal.Actions>

                <Button
                    onClick={() => {
                        setOpen(false);
                        props.setEditTab(false);
                    }}
                    content="Отмена"
                />

                <Button
                    onClick={() => setSave(true)}
                    color="green"
                    disabled={loading || errorData}
                    icon
                    labelPosition="right"
                >
                    {edit ? "Сохранить" : "Создать"} <Icon name="save" />
                </Button>

            </Modal.Actions>

        </Modal>

    </>

}