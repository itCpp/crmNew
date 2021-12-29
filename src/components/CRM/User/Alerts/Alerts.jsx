import React from "react";
import { Grid } from "semantic-ui-react";
import Requests from "./AlertsRequests";

const Alerts = ({ data }) => {

    const height = 350;

    return <Grid.Row columns={Object.keys(data).length}>

        <Grid.Column>
            <Requests requests={data.requests || []} height={height} />
        </Grid.Column>

    </Grid.Row>

}

export default Alerts;