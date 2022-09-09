import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Dimmer, Form, Header, Icon, Loader, Message, Modal } from "semantic-ui-react";
import { axios } from "../../../utils";
import AdminContentSegment from "../UI/AdminContentSegment";

const SecondCalls = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {

        setLoading(true);

        axios.post('dev/calls/extensions')
            .then(({ data }) => setRows(data.rows))
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoading(false))

    }, [props?.location?.key]);

    return <div style={{ maxWidth: 600 }}>

        <ExtensionRowEdit
            show={show}
            close={() => setShow(false)}
            setRows={setRows}
        />

        <AdminContentSegment
            className="d-flex align-items-center"
            content={<>
                <Header
                    as="h2"
                    content="Внутренние номера"
                    subheader="Настройка внутренних учетных записей телефонии"
                    className="flex-grow-1"
                />

                {loading && <Loader active inline />}

                {!loading && <Button
                    icon="plus"
                    basic
                    circular
                    color="green"
                    onClick={() => setShow(true)}
                />}

            </>}
        />

        {!loading && error && <Message error content={error} />}

        {!loading && !error && rows.length > 0 && <AdminContentSegment>

            {rows.map(row => <ExtensionRow key={row.id} row={row} setShow={setShow} />)}

        </AdminContentSegment>}

        {!loading && !error && rows.length === 0 && <AdminContentSegment
            className="text-center py-4"
            content={<strong className="opacity-50">Данных нет</strong>}
        />}

    </div>
}

const ExtensionRow = props => {

    const { row, setShow } = props;

    return <div className="d-flex align-items-center extension-row">
        <div className="flex-grow-1"><Icon name="user" disabled />{row.extension}</div>
        {Boolean(row.internal_addr) && <div className="mr-3" title="Привязан к столу">
            <Icon name="desktop" disabled />
            {row.internal_addr}
        </div>}
        <div>
            <Icon
                name="reply"
                color={row.for_in === 1 ? "green" : null}
                disabled={row.for_in === 0}
                title="Вторичный входящий звонок"
            />
        </div>
        <div>
            <Icon
                name="pencil"
                link
                className="ml-3 mr-0"
                title="Изменить"
                onClick={() => setShow(row)}
            />
        </div>
    </div>
}

const ExtensionRowEdit = props => {

    const { show, close, setRows } = props;
    const open = Boolean(show);

    const [loading, setLoading] = React.useState(true);
    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);

    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const handleChange = (e, { name, value }) => setFormdata(p => ({ ...p, [name]: value }));

    React.useEffect(() => {

        if (show?.id) {
            axios.post('dev/calls/extension', { id: show.id })
                .then(({ data }) => {
                    setFormdata(data.row);
                })
                .catch(e => { })
                .then(() => setLoading(false));
        } else {
            setLoading(false);
        }

        return () => {
            setLoading(true);
            setFormdata({});
            setErrors({});
            setError(null);
        }

    }, [show]);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('dev/calls/extension/save', formdata)
                .then(({ data }) => {
                    setRows(p => {
                        let rows = [...p],
                            added = true;

                        rows.forEach((row, i) => {
                            if (row.id === data.row.id) {
                                rows[i] = data.row;
                                added = false;
                            }
                        });

                        if (added) rows.unshift(data.row);

                        return rows;
                    });
                    close();
                })
                .catch(e => {
                    setError(axios.getError(e));
                    setErrors(axios.getErrors(e));
                })
                .then(() => {
                    setLoading(false);
                    setSave(false);
                });
        }

    }, [save]);

    return <Modal
        open={open}
        header="Внутренний номер"
        centered={false}
        size="mini"
        closeIcon
        onClose={close}
        content={{
            content: <div className="position-relative">

                <Form>

                    <Form.Input
                        label="Extension"
                        placeholder="Внутренний идентификатор"
                        name="extension"
                        value={formdata?.extension || ""}
                        onChange={handleChange}
                        error={Boolean(errors?.extension)}
                    />

                    <Form.Input
                        label="IP адрес компьютера"
                        placeholder="Адрес стола"
                        name="internal_addr"
                        value={formdata?.internal_addr || ""}
                        onChange={handleChange}
                        error={Boolean(errors?.internal_addr)}
                    />

                    <Form.Checkbox
                        label="Для вторичных звонков"
                        checked={Boolean(formdata?.for_in)}
                        onChange={(e, { checked }) => setFormdata(p => ({ ...p, for_in: checked ? 1 : 0 }))}
                    />

                </Form>

                {error && <div className="mt-3 text-danger">
                    <strong>Ошибка</strong>
                    <span>{' '}{error}</span>
                </div>}

                <Button
                    content="Сохранить"
                    icon="save"
                    labelPosition="right"
                    onClick={() => setSave(true)}
                    color="green"
                    fluid
                    className="mt-4"
                />

                <Dimmer active={loading} inverted><Loader /></Dimmer>

            </div>
        }}
    />

}

export default withRouter(SecondCalls);