import React from "react";
import axios from "./../../../../utils/axios-header";
import { Header, Modal, Placeholder, Form, Message, Dimmer, Loader } from "semantic-ui-react";

function RoleSources(props) {

    const { open, setOpen, roles, setRoles } = props;

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(false);
    const [sources, setSources] = React.useState([]);
    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {

        if (save) {

            setLoad(save.sourceId);

            axios.post('dev/role/setSource', {
                ...save,
                role: formdata.role
            }).then(({ data }) => {

                let newRoles = [...roles];

                roles.forEach((role, i) => {
                    if (role.role === data.role.role)
                        newRoles[i] = data.role;
                });

                setRoles(newRoles);
                setFormdata(data.role);

            }).catch(error => {
                axios.toast(error);
            }).then(() => {
                setLoad(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    React.useEffect(() => {

        if (open && open !== true) {

            setLoading(true);

            axios.post('dev/getRole', {
                role: open,
                getSources: true,
            }).then(({ data }) => {
                setFormdata(data.role);
                setSources(data.sources);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }
        else if (open)
            setLoading(false);

    }, [open]);

    return <Modal
        centered={false}
        open={open ? true : false}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="tiny"
        closeOnDimmerClick={false}
        closeOnEscape={false}
        closeIcon
    >
        <Modal.Header>Доступные источники для роли</Modal.Header>

        <Modal.Content>

            {error && <Message error content={error} />}

            {loading && <Placeholder fluid style={{ marginRight: 0 }}>
                <Placeholder.Line></Placeholder.Line>
                <Placeholder.Line></Placeholder.Line>
                <Placeholder.Line></Placeholder.Line>
                <Placeholder.Line></Placeholder.Line>
                <Placeholder.Line></Placeholder.Line>
                <Placeholder.Line></Placeholder.Line>
            </Placeholder>}

            {!loading && <Form loading={loading} className="selected-all">

                {formdata?.name && <Header
                    as="h5"
                    content={formdata.name}
                    subheader={formdata.comment || false}
                    className="mb-4"
                />}

                {sources.map(row => <div
                    key={row.id}
                    children={<div className="d-flex align-items-center position-relative">

                        <Form.Checkbox
                            toggle
                            className="mb-0 mx-1"
                            checked={(formdata.sourcesId && formdata.sourcesId.indexOf(row.id) >= 0 ? true : false) || formdata.is_superadmin === true}
                            disabled={formdata.is_superadmin === true}
                            onChange={(e, { checked }) => setSave({ sourceId: row.id, checked })}
                            label={row.name}
                        />

                        {load === row.id && <Dimmer active inverted>
                            <Loader active size="small" />
                        </Dimmer>}

                    </div>}
                />)}

            </Form>}

        </Modal.Content>

    </Modal >

}

export default RoleSources;