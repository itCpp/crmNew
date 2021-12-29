import React from "react";
import { useSelector } from "react-redux";
import axios from "./../../../utils/axios-header";
import { Message, Loader, Grid, Header } from "semantic-ui-react";
import Chart from "./ChartData";
import Rating from "./Rating";

const User = props => {

    const { userData, worktime } = useSelector(state => state.main);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState({});

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

                <Grid.Row columns={2}>
                    <Grid.Column>
                        <div className="block-card mb-3 px-3">
                            <Header as="h5">Количество приходов</Header>
                            <Chart data={data.charts?.comings} title="Приходы" />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div className="block-card mb-3 px-3">
                            <Header as="h5">Количество выданных заявок</Header>
                            <Chart data={data.charts?.requests} title="Заявки" color="#fc0" />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>



        </>}

    </div>
}

export default User;