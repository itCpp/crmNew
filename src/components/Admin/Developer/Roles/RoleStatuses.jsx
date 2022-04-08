import React from "react";
import axios from "./../../../../utils/axios-header";
import { Header, Modal, Placeholder, Form, Message, Dimmer, Loader } from "semantic-ui-react";

function RoleStatuses(props) {

    const { open, setOpen, roles, setRoles } = props;

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(false);
    const [tabs, setTabs] = React.useState([]);

    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);

    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const setTab = (id, checked) => {

        console.log(id, checked);

    }

    React.useEffect(() => {

        if (save) {

            setLoad(save.tabId);

            axios.post('dev/setStatusForRole', { ...save, role: formdata.role }).then(({ data }) => {

                let newRoles = [...roles];

                roles.forEach((role, i) => {
                    if (role.role === data.role.role)
                        newRoles[i] = data.role;
                });

                setRoles(newRoles);
                setFormdata(data.role);

            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoad(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    React.useEffect(() => {

        if (open && open !== true) {

            setLoading(true);

            axios.post('dev/getRole', { role: open, tabsInfo: true }).then(({ data }) => {
                setFormdata(data.role);
                setTabs(data.statuses);
            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
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
        <Modal.Header>Доступные статусы для роли</Modal.Header>

        <Modal.Content>

            {error
                ? <Message error>{error}</Message>
                : null
            }

            {loading
                ? <Placeholder fluid style={{ marginRight: 0 }}>
                    <Placeholder.Line></Placeholder.Line>
                    <Placeholder.Line></Placeholder.Line>
                    <Placeholder.Line></Placeholder.Line>
                    <Placeholder.Line></Placeholder.Line>
                    <Placeholder.Line></Placeholder.Line>
                    <Placeholder.Line></Placeholder.Line>
                </Placeholder>
                : <Form loading={loading} className="selected-all">

                    {formdata?.name && <Header
                        as="h5"
                        content={formdata.name}
                        subheader={formdata.comment || false}
                        className="mb-4"
                    />}

                    {tabs.map(row => <div className="d-flex align-items-center position-relative" key={row.id}>

                        <div className="px-1">
                            <Form.Checkbox
                                toggle
                                checked={(formdata.statusesId && formdata.statusesId.indexOf(row.id) >= 0 ? true : false) || formdata.is_superadmin === true}
                                disabled={formdata.is_superadmin === true}
                                onChange={(e, { checked }) => setSave({ statusId: row.id, checked })}
                            />
                        </div>

                        <div style={{ marginLeft: "1rem" }}>
                            <div><b>{row.name}</b></div>
                        </div>

                        {load === row.id
                            ? <Dimmer active inverted><Loader active size="small" /></Dimmer>
                            : null
                        }

                    </div>)}

                </Form>
            }

        </Modal.Content>

    </Modal>

}

export default RoleStatuses;