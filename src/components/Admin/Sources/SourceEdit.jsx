import React from "react";
import axios from "./../../../utils/axios-header";

import { Button, Modal, Form, Message, Label } from "semantic-ui-react";

import ResourceSwitch from "./ResourceSwitch";

const CreateSource = props => {

    const { sourceId, setOpen, updateSources } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [save, setSave] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});

    const changeFormdata = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
            ? e.checked
            : e.value;

        setFormdata({ ...formdata, [e.name]: value });

    }

    React.useEffect(() => {

        setLoad(true);

        axios.post('dev/getSourceData', { id: sourceId }).then(({ data }) => {
            setFormdata(data.source);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoad(false);
        });

    }, []);

    React.useEffect(() => {

        if (save) {

            setLoad(true);

            axios.post('dev/saveSourceData', { ...formdata }).then(({ data }) => {
                updateSources(data.source);
                setOpen(null);
            }).catch(error => {
                setError(axios.getError(error));
                setLoad(false);
            });

        }

        return () => setSave(null);

    }, [save]);

    return <Modal
        closeIcon
        open={sourceId ? true : false}
        onClose={() => setOpen(null)}
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        size="tiny"
    >

        <Modal.Header className="d-flex justify-content-start align-items-center">
            <span style={{ marginRight: ".5rem" }}>Настройки источника</span>
            <Label color="green" horizontal content={`#${sourceId}`} />
        </Modal.Header>

        <Modal.Content className="position-relative">

            <Form loading={load}>

                <Form.Input
                    placeholder="Укажите наименование источника..."
                    label="Наименование источника"
                    name="name"
                    value={formdata.name || ""}
                    onChange={changeFormdata}
                    disabled={error ? true : false}
                />

                <Form.Input
                    placeholder="Укажите короткое наименование для дисплея приложения звонков..."
                    label="Короткое наименование для вывода в телефоне"
                    name="abbr_name"
                    value={formdata.abbr_name || ""}
                    onChange={changeFormdata}
                    disabled={error ? true : false}
                />

                <Form.TextArea
                    label="Комментарий к источнику"
                    placeholder="Краткое описание к источнику..."
                    name="comment"
                    value={formdata.comment || ""}
                    onChange={changeFormdata}
                    rows={4}
                    disabled={error ? true : false}
                />

                <div className="field mb-2">
                    <label>Прочие настройки</label>
                </div>

                <Form.Checkbox
                    label="Отображать в счетчике доп. информации"
                    name="show_counter"
                    checked={formdata.show_counter === 1 || formdata.show_counter === true ? true : false}
                    onChange={changeFormdata}
                    disabled={error ? true : false}
                />

                <Form.Checkbox
                    label="Отображать в списке при создании новой заявки"
                    name="actual_list"
                    checked={formdata.actual_list === 1 || formdata.actual_list === true ? true : false}
                    onChange={changeFormdata}
                    disabled={error ? true : false}
                />

                <Form.Checkbox
                    label="Автоматически добавлять текстовую заявку из очереди"
                    name="auto_done_text_queue"
                    checked={formdata.auto_done_text_queue === 1 || formdata.auto_done_text_queue === true ? true : false}
                    onChange={changeFormdata}
                    disabled={error ? true : false}
                />

                {typeof formdata.resources == "object" && formdata.resources.length > 0
                    ? <div className="field mb-0">
                        <hr />
                        <label>Активные ресурсы источника</label>
                        {formdata.resources.map(resource => <ResourceSwitch
                            key={resource.id}
                            sourceId={sourceId}
                            resource={resource}
                            updateSource={updateSources}
                            checkedDefault={true}
                        />)}
                    </div>
                    : null
                }

            </Form>

            {error
                ? <Message error content={error} className="mb-0 mt-3" />
                : null
            }

        </Modal.Content>

        <Modal.Actions>
            <Button
                color="black"
                onClick={() => setOpen(false)}
                content="Отмена"
            />
            <Button
                content="Сохранить"
                labelPosition="right"
                icon="save"
                onClick={() => setSave(true)}
                positive
                disabled={load || error ? true : false}
            />
        </Modal.Actions>

    </Modal>

}

export default CreateSource;