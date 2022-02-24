import React from "react";
import axios from "../../../../utils/axios-header";
import { useDispatch } from "react-redux";
import { updateRequestRow } from "../../../../store/requests/actions";
import RequestEditForm from "../RequestEdit/RequestEditForm";
import { Button } from "semantic-ui-react";
import { useRequestGetRowSerialize } from "../../hooks";

const RequestPageEditForm = props => {

    const { data, setRow, error } = props;
    const { permits, statuses, cities, themes, adresses, setRowData } = useRequestGetRowSerialize(data);

    const dispatch = useDispatch();

    const [formdata, setFormdata] = React.useState(data.request);
    const [formdataControl, setFormdataControl] = React.useState({ ...data.request });

    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    const changed = JSON.stringify(formdata) !== JSON.stringify(formdataControl);

    const onChange = (e, { name, value }) => {
        setFormdata(formdata => ({ ...formdata, [name]: value === "" ? null : value }));
    }

    React.useEffect(() => {

        if (save) {

            axios.post('requests/save', formdata).then(({ data }) => {

                setSaveError(false);
                setSaveErrors({});

                setFormdata({ ...data.request });
                setFormdataControl({ ...data.request });
                setRow({ ...data.request });

                dispatch(updateRequestRow(data.request));
            }).catch(e => {
                axios.toast(e, { time: 15000 });
                setSaveError(axios.getError(e));
                setSaveErrors(axios.getErrors(e));
            }).then(() => {
                setSave(false);
            });
        }

    }, [save]);

    return <div className="block-card">

        <div id="request-edit-page">

            <RequestEditForm
                formdata={formdata}
                permits={permits}
                statuses={statuses}
                cities={cities}
                themes={themes}
                adresses={adresses}
                onChange={onChange}
                loading={save}
                errors={saveErrors}
            />

            <div className="d-flex mt-3">

                <Button
                    content="Отменить"
                    color="blue"
                    basic={!changed}
                    className="mr-1 w-100"
                    disabled={!changed || (error ? true : false) || save}
                    onClick={() => setFormdata({ ...formdataControl })}
                />

                <Button
                    content="Сохранить"
                    icon="save"
                    labelPosition="right"
                    color="green"
                    basic={!changed}
                    className="ml-1 mr-0 w-100"
                    disabled={!changed || (error ? true : false) || save}
                    onClick={() => setSave(true)}
                />

            </div>

        </div>

    </div>

}

export default RequestPageEditForm;