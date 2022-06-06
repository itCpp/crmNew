import React from "react";
import axios from "./../../../utils/axios-header";
import { Button, Modal, Dimmer, Loader, Message } from "semantic-ui-react";
import StatusForm from "./StatusForm";

const EditStatus = props => {

    const { statuses, setStatuses } = props;
    const { open, setOpen } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [save, setSave] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});
    const [settings, setSettings] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {

        setLoad(true);

        axios.post('dev/getStatusData', { id: open }).then(({ data }) => {
            setFormdata(data.status);
            setSettings(data.settings);
            setLoaded(p => !p);
            setError(null);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoad(false);
        });

    }, []);

    React.useEffect(() => {

        if (save) {

            setLoad(true);

            axios.post('dev/saveStatus', formdata).then(({ data }) => {

                if (typeof setStatuses == "function") {
                    let list = [...statuses];
                    list.forEach((status, i) => {
                        if (status.id === data.status.id)
                            list[i] = data.status;
                    });
                    setStatuses(list);
                }

                setOpen(false);

            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoad(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <Modal
        closeIcon
        open={open ? true : false}
        onClose={() => setOpen(false)}
        size="tiny"
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >

        <Modal.Header>Настройки статуса</Modal.Header>
        <Modal.Content className="position-relative">

            <StatusForm
                formdata={formdata}
                setFormdata={setFormdata}
                errors={errors}
                settings={settings}
                loaded={loaded}
            />

            {error && <Message error content={error} className="mb-0" />}

            <Dimmer active={load} inverted>
                <Loader inverted />
            </Dimmer>

        </Modal.Content>

        <Modal.Actions className="py-2">
            <Button
                onClick={() => setOpen(false)}
                content="Отмена"
            />
            <Button
                content="Сохранить"
                labelPosition="right"
                icon="save"
                onClick={() => setSave(true)}
                positive
                disabled={load}
            />
        </Modal.Actions>

    </Modal>

}

export default EditStatus;