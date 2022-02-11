import React from "react";
import RequestEditForm from "../RequestEdit/RequestEditForm";
import { Button } from "semantic-ui-react";
import { useRequestGetRowSerialize } from "../../hooks";

const RequestPageEditForm = props => {

    const { data, error } = props;
    const { permits, statuses, cities, themes, adresses, setRowData } = useRequestGetRowSerialize(data);

    const [formdata, setFormdata] = React.useState(data.request);
    const [formdataControl, setFormdataControl] = React.useState({ ...data.request });

    const changed = JSON.stringify(formdata) !== JSON.stringify(formdataControl);

    const onChange = React.useCallback((e, { name, value }) => {
        setFormdata({ ...formdata, [name]: value === "" ? null : value });
    }, [formdata]);

    return <div className="block-card">
        <RequestEditForm
            formdata={formdata}
            permits={permits}
            statuses={statuses}
            cities={cities}
            themes={themes}
            adresses={adresses}
            onChange={onChange}
        />
        <div className="d-flex mt-3">
            <Button
                content="Отменить"
                color="blue"
                basic={!changed}
                className="mr-2 w-100"
                disabled={!changed || error ? true : false}
                onClick={() => setFormdata({ ...formdataControl })}
            />
            <Button
                content="Сохранить"
                icon="save"
                labelPosition="right"
                color="green"
                basic={!changed}
                className="m-0 w-100"
                disabled={!changed || error ? true : false}
            />
        </div>
    </div>

}

export default RequestPageEditForm;