import React from "react";
import { Grid } from "semantic-ui-react";
import Requests from "./AlertsRequests";
import Notifications from "./AlertsNotifications";

const Alerts = ({ requestsAccess, data, updateNotification }) => {

    const height = 350;

    return <Grid.Row columns={Object.keys(data).length}>

        <Grid.Column>
            <Notifications
                notifications={data.notifications || null}
                updateNotification={updateNotification}
                height={height}
            />
        </Grid.Column>

        {requestsAccess && <Grid.Column>
            <Requests
                requests={data.requests || []}
                updateNotification={updateNotification}
                height={height}
            />
        </Grid.Column>}

    </Grid.Row>

}

export default Alerts;