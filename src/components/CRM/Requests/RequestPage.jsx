import axios from "../../../utils/axios-header";
import React from "react";
import { useDispatch } from "react-redux";
import {
    setRequestEditPage,
    setShowAudioCall,
    setSendSms
} from "../../../store/requests/actions";
import { Button, Grid, Header, Icon, Loader, Message } from "semantic-ui-react";
import RequestPageEditForm from "./ReqquestPage/RequestPageEditForm";
import Comments from "./RequestEdit/Comments/CommentsEditRequest";
import RequestRowStatistic from "./ReqquestPage/RequestRowStatistic";

const RequestPage = props => {

    const dispatch = useDispatch();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [row, setRow] = React.useState(props.row);
    const [formdata, setFormdata] = React.useState(row);
    const [formdataControl, setFormdataControl] = React.useState(row);
    const [data, setData] = React.useState({});
    const [comments, setComments] = React.useState([]);

    React.useEffect(() => {

        setLoading(true);

        axios.post('requests/getRow', {
            id: row.id,
            getComments: true,
            getStatistics: true,
        }).then(({ data }) => {
            setFormdata(data.request);
            setFormdataControl({ ...data.request });
            setError(null);
            setData(data);
            setComments(data.comments || []);
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
                        onClick={() => dispatch(setRequestEditPage(false))}
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

                    {row.status_records_flash && <span className="mx-1">
                        <Icon
                            name="warning sign"
                            size="big"
                            color="red"
                            fitted
                            title="Необходимо подтвердить запись"
                        />
                    </span>}

                    <Button
                        icon="mail"
                        circular
                        basic
                        color="yellow"
                        className="mx-1"
                        onClick={() => dispatch(setSendSms(row.id))}
                        title="СМС сообщения в заявке"
                        disabled={error ? true : false}
                    />

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

                    {/* <Button
                        icon="save"
                        circular
                        basic={!changed}
                        color="green"
                        className="mx-1"
                        title="Сохранить изменения"
                        disabled={!changed || error ? true : false}
                    /> */}

                </div>}

                {loading && <Loader active inline />}

            </div>

        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <Grid className="mt-3">

            <RequestRowStatistic data={data} />

            <Grid.Row columns="2" stretched>

                <Grid.Column width={10}>
                    <RequestPageEditForm
                        data={data}
                        setRow={setRow}
                    />
                </Grid.Column>

                <Grid.Column className="h-100" width={6}>
                    <div className="block-card">
                        <Comments
                            row={row}
                            comments={comments}
                            setComments={setComments}
                            checkMaxHeight="request-edit-page"
                        />
                    </div>
                </Grid.Column>

            </Grid.Row>

        </Grid>}

    </div>

}

export default RequestPage;