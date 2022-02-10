import axios from "../../../utils/axios-header";
import React from "react";
import { useDispatch } from "react-redux";
import { requestEditPage, setShowAudioCall } from "../../../store/requests/actions";
import { Button, Grid, Header, Icon, Loader, Message } from "semantic-ui-react";
import RequestEditForm from "./RequestEdit/RequestEditForm";
import { useRequestGetRowSerialize } from "../hooks";

const RequestPage = props => {

    const dispatch = useDispatch();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const { row } = props;
    const [formdata, setFormdata] = React.useState(row);
    const [formdataControl, setFormdataControl] = React.useState(row);

    const { permits, statuses, cities, themes, adresses, setOptionsData } = useRequestGetRowSerialize();

    const changed = JSON.stringify(formdata) !== JSON.stringify(formdataControl);

    React.useEffect(() => {

        setLoading(true);

        axios.post('requests/getRow', {
            id: row.id,
            getComments: true,
        }).then(({ data }) => {
            setFormdata(data.request);
            setFormdataControl({ ...data.request });
            setError(null);
            setOptionsData(data);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="mt-3">

        <div className="block-card">

            <div className="d-flex justify-content-between align-items-center">

                <span>
                    <Icon
                        name="arrow left"
                        link
                        size="big"
                        className="mr-4"
                        onClick={() => dispatch(requestEditPage(false))}
                        title="Назад к заявкам"
                    />
                </span>

                <Header
                    as="h3"
                    content={`Заявка #${row.id}`}
                    subheader={row.source?.name || null}
                    className="flex-grow-1 m-0"
                />

                {!loading && <div className="d-flex align-items-center">

                    <Button
                        icon="file audio"
                        circular
                        basic
                        color="blue"
                        className="mx-1"
                        onClick={() => dispatch(setShowAudioCall({ request: row.id }))}
                        title="Аудиозаписи разговоров"
                        disabled={error ? true : false}
                    />

                    <Button
                        icon="save"
                        circular
                        basic={!changed}
                        color="green"
                        className="mx-1"
                        title="Сохранить изменения"
                        disabled={!changed || error ? true : false}
                    />

                </div>}

                {loading && <Loader active inline />}

            </div>

        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <Grid className="mt-3">

            <Grid.Row columns="equal">

                <Grid.Column>
                    <div className="block-card">
                        <RequestEditForm
                            formdata={formdata}
                            permits={permits}
                            statuses={statuses}
                            cities={cities}
                            themes={themes}
                            adresses={adresses}
                        />
                    </div>
                </Grid.Column>

                <Grid.Column>
                    <div className="block-card">

                    </div>
                </Grid.Column>

            </Grid.Row>

        </Grid>}

    </div>

}

export default RequestPage;