import React from "react";
import axios from "./../../../utils/axios-header";

import { Icon, Checkbox, Dimmer, Loader } from "semantic-ui-react";

function ResourceSwitch(props) {

    const { sourceId, resource, updateSource } = props;

    const [checked, setChecked] = React.useState(true);
    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);

    const setResource = (...e) => {

        setLoad(true);

        axios.post('dev/setResourceToSource', {
            sourceId,
            resourceId: resource.id,
            set: e[1].checked,
        }).then(({ data }) => {

            setError(null);
            setChecked(data.checked);

            if (typeof updateSource == "function")
                updateSource(data.source);

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoad(false);
        });

    }

    return <div className="d-flex justify-content-between align-items-center resource-switch">

        <div className="resource-name">
            <Icon
                name={resource.type === "phone" ? "phone" : "world"}
                color={error ? "red" : "black"}
            />
            <span>{resource.val}</span>
        </div>
        <div className="resource-checkbox">
            <Checkbox
                toggle
                onClick={setResource}
                checked={checked}
            />
        </div>

        <Dimmer active={load} inverted>
            <Loader inverted size="small" />
        </Dimmer>

    </div>

}

export default ResourceSwitch;