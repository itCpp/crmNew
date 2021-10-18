import _ from "lodash";
import React from "react";
import axios from "./../../utils/axios-header";
import { toast } from 'react-semantic-toasts';

import { Icon, Form, Placeholder, Button, Dropdown } from "semantic-ui-react";

const caseSensitiveSearch = (options, query) => {
    const re = new RegExp(_.escapeRegExp(query))
    return options.filter((opt) => re.test(opt.text))
}

const RequestEditCell = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [load, setLoad] = React.useState(false);

    const [formdata, setFormdata] = React.useState({});
    const [permits, setPermits] = React.useState({});
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {

        if (props?.editCell?.id) {

            const modal = document.getElementById('request-edit-modal');
            const css = {
                x: props?.editCell?.pageX || 0,
                y: props?.editCell?.pageY || 0,
                display: "block",
            }

            if (modal) {

                const clientHeight = document.documentElement.clientHeight;

                if (clientHeight < css.y + modal.clientHeight) {
                    css.y = (css.y + (clientHeight - (css.y + modal.clientHeight))) - 5;
                }

            }

            setLoading(true);
            setPosition(css);

            axios.post('requests/getRow', {
                id: props.editCell?.id
            }).then(({ data }) => {

                let formdata = {
                    request: data.request,
                    addresses: [],
                    cities: [],
                    themes: [],
                };

                formdata.addresses = [
                    {
                        id: null,
                        name: "Не указан"
                    },
                    ...data.offices
                ].map((office, key) => ({
                    key,
                    text: office.name,
                    value: office.id,
                    disabled: office.active === 0 ? true : false
                }));

                formdata.cities = [null, ...data.cities].map((row, key) => ({
                    key, value: row, text: row || "Не определен"
                }));

                formdata.themes = [null, ...data.themes].map((row, key) => ({
                    key, value: row, text: row || "Не определена"
                }));

                setFormdata(formdata);
                setPermits(data.permits);

            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
                setLoad(false);
            });

        }

    }, [props?.editCell?.id, props?.editCell?.type]);

    const changeData = (name, value) => {
        let data = { ...formdata.request, [name]: value };
        setFormdata({ ...formdata, request: data });
    }

    React.useEffect(() => {

        if (save) {

            setLoad(true);

            axios.post('requests/saveCell', {
                ...formdata?.request,
                __cell: props?.editCell?.type
            }).then(({ data }) => {
                props.updateRequestRow(data.request);
                props.setEditCell(null);
            }).catch(error => {
                let message = axios.getError(error);
                toast({
                    type: "error",
                    title: 'Ошибка',
                    description: message,
                    time: 10000,
                    animation: "fly right",
                });
                setError(message);
                setErrors(axios.getErrors(error));
                setLoad(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    // const [drag, setDrag] = React.useState({ move: false });

    // const onMouseDown = e => {
    //     return;
    //     setDrag({ ...drag, move: true });
    // }

    // const onMouseMove = e => {
    //     return;
    //     if (!drag.move) return;
    //     // const modal = document.getElementById('request-edit-modal');
    //     setPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    // }

    // const onMouseUp = e => {
    //     return;
    //     setDrag({ ...drag, move: false });
    // }

    return <RequestEditCellSwitch
        {...props}
        formdata={formdata}
        permits={permits}
        changeData={changeData}
        errors={errors}
        loading={loading}
        setSave={setSave}
        load={load}
        css={position}
        // onMouseDown={onMouseDown}
        // onMouseMove={onMouseMove}
        // onMouseUp={onMouseUp}
    />

}

export default RequestEditCell;

const RequestEditCellSwitch = props => {

    switch (props?.editCell?.type) {
        case "date":
            return <EditDate {...props} />
        case "client":
            return <EditClient {...props} />
        case "theme":
            return <EditTheme {...props} />
        case "commentFirst":
            return <EditCommentFirst {...props} />
        case "comment":
            return <EditComment {...props} />
        case "commentUrist":
            return <EditCommentUrist {...props} />
        default:
            return null;

    }

}

const TitleLoader = () => <Placeholder className="w-100">
    <Placeholder.Header>
        <Placeholder.Line />
    </Placeholder.Header>
</Placeholder>

const ModalHeader = props => <div className="request-edit-cell-header">
    {props?.formdata?.request?.id && !props?.loading ? <span className="flex-grow-1 header-for-drag" onMouseDown={props.onMouseDown} onMouseMove={props.onMouseMove} onMouseUp={props.onMouseUp}>#{props.formdata.request.id}</span> : <TitleLoader />}
    <span><Icon name="close" onClick={() => props.setEditCell(null)} /></span>
</div>

const ModalBody = props => <div
    className={`request-edit-cell shadow`}
    style={{
        top: props.css.y,
        left: props?.css?.x ? props.css.x - 220 : 0,
        display: props?.css?.display || "none",
    }}
    id="request-edit-modal"
>{props.body || null}</div>

const SaveButton = props => <Button
    fluid
    color="green"
    icon="save"
    content="Сохранить"
    onClick={() => props.setSave(true)}
    loading={props.load ? true : false}
/>

const EditDate = props => <ModalBody {...props}
    body={<>

        <ModalHeader {...props} />

        <Form className="request-edit-cell-body" loading={props.loading}>

            <Form.Field className="mb-2">
                <label><Icon name="map marker alternate" />Адрес</label>
                <Form.Select
                    placeholder="Укажите адрес офиса"
                    options={props?.formdata?.addresses || []}
                    name="address"
                    value={props?.formdata?.request?.address || null}
                    onChange={(e, { name, value }) => props.changeData(name, value)}
                    error={props?.errors?.address ? true : false}
                    disabled={props.load || (props?.permits?.requests_addr_change ? false : true) ? true : false}
                />
            </Form.Field>

            <Form.Field className="mb-2">
                <label><Icon name="calendar check outline" />Дата и время записи</label>
                <Form.Input
                    placeholder="Укажите дату"
                    type="datetime-local"
                    name="event_datetime"
                    value={props?.formdata?.request?.event_datetime || ""}
                    onChange={(e, { name, value }) => props.changeData(name, value)}
                    error={props?.errors?.event_datetime ? true : false}
                    disabled={props.load ? true : false}
                />
            </Form.Field>

            <SaveButton {...props} />

        </Form>

    </>}

/>

const EditClient = props => <ModalBody {...props}
    body={<>

        <ModalHeader {...props} />

        <Form className="request-edit-cell-body" loading={props.loading}>

            <Form.Field className="mb-2">
                <label><Icon name="user" />ФИО клиента</label>
                <Form.Input
                    placeholder="Укажите ФИО клиента"
                    name="client_name"
                    value={props?.formdata?.request?.client_name || ""}
                    onChange={(e, { name, value }) => props.changeData(name, value)}
                    error={props?.errors?.client_name ? true : false}
                    disabled={props.load ? true : false}
                />
            </Form.Field>

            <Form.Field className="mb-2">
                <label><Icon name="world" />Город</label>
                <Dropdown
                    fluid
                    placeholder="Укажите город"
                    search={caseSensitiveSearch}
                    selection
                    options={props?.formdata?.cities || []}
                    name="region"
                    value={props?.formdata?.request?.region || ""}
                    onChange={(e, { name, value }) => props.changeData(name, value)}
                    error={props?.errors?.region ? true : false}
                    disabled={props.load ? true : false}
                />
            </Form.Field>

            <SaveButton {...props} />

        </Form>

    </>}

/>


const EditTheme = props => <ModalBody {...props}
    body={<>

        <ModalHeader {...props} />

        <Form className="request-edit-cell-body" loading={props.loading}>

            <Form.Field className="mb-2">
                <label><Icon name="book" />Тематика</label>
                <Dropdown
                    placeholder="Укажите тематику"
                    search={caseSensitiveSearch}
                    selection
                    options={props?.formdata?.themes || []}
                    name="theme"
                    value={props?.formdata?.request?.theme || ""}
                    onChange={(e, { name, value }) => props.changeData(name, value)}
                    error={props?.errors?.theme ? true : false}
                />
            </Form.Field>

            <SaveButton {...props} />

        </Form>

    </>}

/>

const EditCommentFirst = props => <ModalBody {...props}
    body={<>

        <ModalHeader {...props} />

        <Form className="request-edit-cell-body" loading={props.loading}>

            <Form.Field className="mb-2">
                <label><Icon name="comment alternate outline" />Первичный комментарий</label>
                <Form.TextArea
                    placeholder="Укажите первичный комментарий"
                    type="time"
                    name="comment_first"
                    rows={4}
                    value={props?.formdata?.request?.comment_first || ""}
                    onChange={(e, { name, value }) => props.changeData(name, value)}
                    error={props?.errors?.comment_first ? true : false}
                />
            </Form.Field>

            <SaveButton {...props} />

        </Form>

    </>}

/>

const EditComment = props => <ModalBody {...props}
    body={<>

        <ModalHeader {...props} />

        <Form className="request-edit-cell-body" loading={props.loading}>

            <Form.Field className="mb-2">
                <label><Icon name="comment outline" />Суть обращения</label>
                <Form.TextArea
                    placeholder="Укажите суть обращения"
                    type="time"
                    name="comment"
                    rows={4}
                    value={props?.formdata?.request?.comment || ""}
                    onChange={(e, { name, value }) => props.changeData(name, value)}
                    error={props?.errors?.comment ? true : false}
                />
            </Form.Field>

            <SaveButton {...props} />

        </Form>

    </>}

/>

const EditCommentUrist = props => <ModalBody {...props}
    body={<>

        <ModalHeader {...props} />

        <Form className="request-edit-cell-body" loading={props.loading}>

            <Form.Field className="mb-2">
                <label><Icon name="comment" />Комментарий юристу</label>
                <Form.TextArea
                    placeholder="Укажите комментарий для юриста"
                    type="time"
                    name="comment_urist"
                    rows={4}
                    value={props?.formdata?.request?.comment_urist || ""}
                    onChange={(e, { name, value }) => props.changeData(name, value)}
                    error={props?.errors?.comment_urist ? true : false}
                />
            </Form.Field>

            <SaveButton {...props} />

        </Form>

    </>}

/>
