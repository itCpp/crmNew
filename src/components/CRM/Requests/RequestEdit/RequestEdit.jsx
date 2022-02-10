import _ from "lodash";
import React from "react";
import axios from "./../../../../utils/axios-header";
import { useDispatch, useSelector } from "react-redux";
import { requestEdit, updateRequestRow } from "../../../../store/requests/actions";
import { Modal, Button, Grid, Dimmer, Loader } from "semantic-ui-react";
import Comments from "./Comments/CommentsEditRequest";
import RequestEditForm from "./RequestEditForm";
import { useRequestGetRowSerialize } from "../../hooks";

const RequestEdit = () => {

    const dispatch = useDispatch();
    const row = useSelector(state => state.requests.requestEdit);
    const setOpen = () => dispatch(requestEdit(null));

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [save, setSave] = React.useState(null);
    const [errorSave, setErrorSave] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [formdata, setFormdata] = React.useState(row);
    const [control, setControl] = React.useState(row);

    const { permits, statuses, cities, themes, adresses, setRowData } = useRequestGetRowSerialize();
    const [comments, setComments] = React.useState([]);

    const changed = JSON.stringify(formdata) !== JSON.stringify(control);

    React.useEffect(() => {

        axios.post('requests/getRow', {
            id: row.id,
            getComments: true,
        }).then(({ data }) => {
            setFormdata(data.request);
            setControl({ ...data.request });
            setComments(data.comments || []);
            setRowData(data);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const changeData = (e, { name, value }) => {
        setFormdata({ ...formdata, [name]: value === "" ? null : value });
    }

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('requests/save', formdata).then(({ data }) => {
                setErrorSave(null);
                dispatch(updateRequestRow(data.request));
                setOpen(null);
            }).catch(error => {
                setError(null);
                setErrorSave(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <Modal
        className="my-large"
        open={true}
        closeIcon
        onClose={() => setOpen(null)}
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >

        <Modal.Header>
            <span>Заявка №<span title="Номер заявки">{row.id}</span></span>
            {row.source?.name ? <span className="text-primary" title="Источник">{' '}{row.source.name}</span> : null}
        </Modal.Header>

        <Modal.Content className="position-relative">

            <Grid>

                <Grid.Column width={6}>

                    <Comments
                        row={row}
                        comments={comments}
                        setComments={setComments}
                    />

                </Grid.Column>

                <Grid.Column width={10}>

                    <RequestEditForm
                        formdata={formdata}
                        onChange={changeData}
                        errors={errors}
                        statuses={statuses}
                        cities={cities}
                        themes={themes}
                        adresses={adresses}
                        permits={permits}
                    />

                </Grid.Column>

            </Grid>

            {loading && <Dimmer active inverted><Loader active /></Dimmer>}

        </Modal.Content>

        <Modal.Actions className="d-flex justify-content-between align-items-center">
            <div>
                {error ? <strong className="text-danger">{error}</strong> : null}
                {errorSave ? <strong className="text-danger">{errorSave}</strong> : null}
            </div>
            <div>
                <Button
                    color="linkedin"
                    content="Отмена"
                    onClick={() => setOpen(null)}
                />
                <Button
                    positive
                    icon="save"
                    labelPosition="right"
                    content="Сохранить"
                    onClick={() => setSave(true)}
                    disabled={loading || error || !changed}
                />
            </div>
        </Modal.Actions>

    </Modal>

}

export default RequestEdit;