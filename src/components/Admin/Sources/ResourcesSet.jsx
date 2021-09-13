import React from "react";
import axios from "./../../../utils/axios-header";

import { Modal, Form, Message, Label } from "semantic-ui-react";

import ResourceSwitch from "./ResourceSwitch";

function ResourcesSet(props) {

    const { sourceId, setOpen, updateSources } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [resources, setResources] = React.useState([]);
    const [freeResources, setFreeResources] = React.useState([]);

    React.useEffect(() => {

        setLoad(true);

        axios.post('dev/getFreeResources', {
            id: sourceId
        }).then(({ data }) => {
            setResources(data.resources);
            setFreeResources(data.freeResources);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoad(false);
        });

    }, []);

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
            <span style={{ marginRight: ".5rem" }}>Настройки ресурсов источника</span>
            <Label color="green" horizontal content={`#${sourceId}`} />
        </Modal.Header>

        <Modal.Content className="position-relative">

            {error
                ? <Message error content={error} />
                : null
            }

            <Form loading={load}>

                <div className="field mb-2">
                    <label>Активные ресурсы</label>
                </div>

                {resources.length
                    ? resources.map(resource => <ResourceSwitch
                        key={resource.id}
                        sourceId={sourceId}
                        resource={resource}
                        updateSource={updateSources}
                        checkedDefault={true}
                    />)
                    : <div className="text-muted my-3 text-center">
                        <small>Активных ресурсов не установлено</small>
                    </div>
                }

                <div className="field mt-3 mb-2">
                    <label>Свободные ресурсы</label>
                </div>

                {freeResources.length
                    ? freeResources.map(resource => <ResourceSwitch
                        key={resource.id}
                        sourceId={sourceId}
                        resource={resource}
                        updateSource={updateSources}
                    />)
                    : <div className="text-muted my-3 text-center">
                        <small>Cвободных ресурсов не осталось</small>
                    </div>
                }

            </Form>

        </Modal.Content>

    </Modal>

}

export default ResourcesSet;
