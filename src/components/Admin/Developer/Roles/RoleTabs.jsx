import React from 'react';
import axios from './../../../../utils/axios-header';

import { Modal, Placeholder, Form, Message, Dimmer, Loader } from 'semantic-ui-react';

function RoleTabs(props) {

    const { open, setOpen, roles, setRoles, setRole } = props;

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

            axios.post('dev/setTabForRole', { ...save, role: formdata.role }).then(({ data }) => {

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
                setTabs(data.tabs);
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
        <Modal.Header>Доступные вкладки для роли</Modal.Header>

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

                    {tabs.map(tab => <div className="d-flex align-items-center position-relative" key={tab.id}>

                        <div className="px-1">
                            <Form.Checkbox
                                toggle
                                checked={formdata.tabsId && formdata.tabsId.indexOf(tab.id) >= 0 ? true : false}
                                onChange={(e, { checked }) => setSave({ tabId: tab.id, checked })}
                            />
                        </div>

                        <div style={{ marginLeft: "1rem" }}>
                            <div><b>{tab.name}</b></div>
                            {tab.name_title ? <div><small>{tab.name_title}</small></div> : null}
                        </div>

                        {load === tab.id
                            ? <Dimmer active inverted><Loader active size="small" /></Dimmer>
                            : null
                        }

                    </div>)}

                </Form>
            }

        </Modal.Content>

    </Modal>

}

export default RoleTabs;