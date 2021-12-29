import React from "react";
import { useSelector } from "react-redux";
import axios from "./../../../utils/axios-header";
import { Message, Loader, Grid, Header } from "semantic-ui-react";
import { Segment } from "../UI";
import Chart from "./ChartData";
import Rating from "./Rating";
import Alerts from "./Alerts/index";

import "./mydata.css";

const User = props => {

    const { userData, worktime } = useSelector(state => state.main);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState({});
    const height = 150;

    React.useEffect(() => {

        setLoading(true);

        axios.post('users/mydata', {
            userId: Number(props?.match?.params?.id),
        }).then(({ data }) => {
            setError(null);
            setData(data);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, [props.location.key]);

    return <div className="pb-3 px-2 w-100">

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Мои данные</h4>
            </div>
        </div>

        {loading && <div><Loader active inline="centered" /></div>}

        {!loading && error && <Message content={error} error style={{ maxWidth: 600 }} />}

        {!loading && !error && <>

            <Grid>

                {data.rating && <Rating data={data.rating} />}

                {data.alerts && <Alerts data={data.alerts} />}

                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Segment header={{ as: "h5", content: "Количество приходов", subheader: "Приходы за последние дни" }}>
                            {data.charts?.comings && data.charts.comings.length > 0
                                ? <Chart
                                    data={data.charts.comings}
                                    title="Приходы"
                                    height={height}
                                />
                                : <EmptyChart
                                    height={height}
                                    text="Данных о Ваших приходах нет"
                                />
                            }
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment header={{ as: "h5", content: "Количество выданных заявок", subheader: "Общее количество выданных заявок за каждый день" }}>
                            {data.charts?.requests && data.charts.requests.length > 0
                                ? <Chart
                                    data={data.charts.requests}
                                    title="Заявки"
                                    color="#fc0"
                                    height={height}
                                />
                                : <EmptyChart
                                    height={height}
                                    text="Заявки еще не выдавались"
                                />
                            }
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </>}

    </div>
}

const EmptyChart = ({ text, height }) => {
    return <div
        className="d-flex justify-content-center align-items-center"
        style={{
            height: height || 200,
            opacity: 0.5,
        }}
        children={text || "Данных нет"}
    />
}

export default User;