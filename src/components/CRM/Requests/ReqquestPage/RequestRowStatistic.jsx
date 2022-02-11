import { Grid } from "semantic-ui-react";
import RequestRowStatisticComing from "./RequestRowStatisticComing";

const RequestRowStatistic = props => {

    const { data } = props;
    const stat = data.statistic || {};

    return <Grid.Row columns="equal" stretched>

        <RequestRowStatisticComing {...props} />

    </Grid.Row>

}

export default RequestRowStatistic;