import { Grid, Header, Statistic } from "semantic-ui-react";
import moment from "moment";

const RequestRowStatisticQueries = props => {

    const row = props.data?.statistic?.queries || [];

    return <Grid.Column>

        <div className="block-card py-3">

            <div className="d-flex align-items-center mb-1">
                <Header
                    as="h3"
                    content="Обращения"
                    className="m-0 flex-grow-1"
                    color="blue"
                />
                {row.last && <small className="opacity-70" titile="Последнее обращение">{moment(row.last).format("DD.MM.YYYY")}</small>}
            </div>

            <Statistic.Group widths="two" size="mini">

                <Statistic>
                    <Statistic.Value>{row.all || 0}</Statistic.Value>
                    <Statistic.Label>Всего</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>{row.source || 0}</Statistic.Value>
                    <Statistic.Label>Источников</Statistic.Label>
                </Statistic>

            </Statistic.Group>

            {/* {coming?.date && <div>{moment(coming.date).format("DD MMMM YYYY")}</div>}
            {coming?.start && <div>Время прихода: <b>{coming.start}</b></div>}
            {coming?.start && <div>Время ухода: {coming?.stop ? <b>{coming.stop}</b> : <i className="text-warning">нет</i>}</div>} */}

        </div>

    </Grid.Column>

}

export default RequestRowStatisticQueries;