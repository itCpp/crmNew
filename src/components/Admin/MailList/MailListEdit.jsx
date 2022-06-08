import React from "react";
import { Button, Dimmer, Form, Icon, Loader, Message, Modal } from "semantic-ui-react";
import packageJson from '../../../../package.json';
import { axios } from "../../../utils";

export const ROW_EMPTY = {
    title: "",
    icon: "",
    message: "",
    type: "",
    to_push: true,
    to_notice: true,
    to_online: false,
    to_telegram: false,
    markdown: false,
}

const MailListEdit = props => {

    const { open, close, setRows } = props;

    const [formdata, setFormdata] = React.useState(ROW_EMPTY);
    const [rowdata, setRowdata] = React.useState(ROW_EMPTY);
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const change = JSON.stringify(formdata) === JSON.stringify(rowdata);

    const changeFormData = React.useCallback((e, { value, name, checked }) => {

        if (typeof checked != "undefined")
            value = checked;

        setFormdata(p => ({ ...p, [name]: value }));

    }, []);

    const appendTextVar = React.useCallback(word => setFormdata(p => {

        let message = String(p.message).trim();
        message += " " + word;

        return { ...p, message: String(message).trim() };
    }), []);

    React.useEffect(() => {

        return () => {
            setFormdata(ROW_EMPTY);
            setRowdata(ROW_EMPTY);
            setSave(false);
            setError(null);
            setErrors({});
        }

    }, [open]);

    React.useEffect(() => {

        if (save) {

            axios.put('admin/mails/create', formdata).then(({ data }) => {
                close();
                setRows(p => ([data.row, ...p]));
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setSave(false);
            });
        }

    }, [save]);

    return <Modal
        open={Boolean(open)}
        centered={false}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        closeOnEscape={false}
        closeIcon={<Icon
            name="close"
            disabled={save}
            onClick={() => save === false && close()}
        />}
        size="small"
        content={<div className="content">
            <Form error={error ? true : false}>

                <Form.Input
                    label="Заголовок уведомления"
                    placeholder="Введите заголовок уведомления"
                    name="title"
                    value={formdata.title || ""}
                    onChange={changeFormData}
                    max={70}
                    error={Boolean(errors.title)}
                />

                <Form.TextArea
                    label="Текст уведомления"
                    placeholder="Введите текст уведомления"
                    rows={5}
                    name="message"
                    value={formdata.message || ""}
                    onChange={changeFormData}
                    error={Boolean(errors.message)}
                />

                <Form.Checkbox
                    label="Отправить быстрое уведомление (push)"
                    name="to_push"
                    checked={formdata.to_push}
                    onChange={changeFormData}
                />

                <Form.Checkbox
                    label="Отправить классическое уведомление (будет сохранено)"
                    name="to_notice"
                    checked={formdata.to_notice}
                    onChange={changeFormData}
                />

                <Form.Checkbox
                    label="Отправить только авторизированным пользователям"
                    name="to_online"
                    checked={formdata.to_online}
                    onChange={changeFormData}
                />

                {/* <Form.Checkbox
                    label="Дублировать в Телеграм"
                    name="to_telegram"
                    checked={formdata.to_telegram}
                    onChange={changeFormData}
                />

                <Form.Checkbox
                    label="Применить стили Markdown"
                    name="markdown"
                    checked={formdata.markdown}
                    onChange={changeFormData}
                /> */}

                <hr />

                <div className="d-flex flex-wrap align-items-center add-words-mail-list">
                    <strong>Наборы:</strong>
                    <Button
                        className="py-1 px-2"
                        size="mini"
                        content={packageJson.version}
                        onClick={() => appendTextVar(packageJson.version)}
                        title="Версия приложения"
                    />
                    <Button
                        className="py-1 px-2"
                        size="mini"
                        color="green"
                        content="Обновление"
                        onClick={() => setFormdata(p => ({
                            ...p,
                            title: `Обновление ${packageJson.version}`,
                            icon: "refresh",
                            message: `Сайт обновлён. Чтобы изменения вступили в силу необходимо обновить страницу браузера при первой возможности.`,
                            to_push: true,
                            to_notice: false,
                            to_online: false,
                            to_telegram: false,
                            markdown: false,
                        }))}
                        title="Набор для уведомления об обновлении"
                    />
                </div>

                <Message error content={error} className="mb-0 py-2 px-3" />

                <Dimmer active={save} inverted>
                    <Loader />
                </Dimmer>

            </Form>
        </div>}
        actions={[
            {
                key: "cancel",
                content: "Сбросить",
                disabled: save,
                onClick: () => {
                    setFormdata(p => ({ ...p, ...ROW_EMPTY }));
                    setRowdata(p => ({ ...p, ...ROW_EMPTY }));
                },
            },
            {
                key: "save",
                content: "Сохранить",
                color: "green",
                icon: "save",
                labelPosition: "right",
                disabled: (String(formdata.message).length === 0) || save,
                onClick: () => setSave(true),
            }
        ]}
    />
}

export default MailListEdit;