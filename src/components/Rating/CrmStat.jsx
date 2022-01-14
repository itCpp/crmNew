import React from "react";
import { Header, Grid } from "semantic-ui-react";

const CrmStat = props => {

    const { data } = props;

    return <div className="rating-callcenter-row pt-4">
        <Grid centered columns="equal">

            <Grid.Column textAlign="center">
                <Header sub>Заявки</Header>
                <strong>{data.requestsAll}</strong>
            </Grid.Column>

            <Grid.Column textAlign="center">
                <Header sub>Заявки Москва</Header>
                <strong>{data.requests}</strong>
            </Grid.Column>

            <Grid.Column textAlign="center">
                <Header sub>Приходы</Header>
                <strong>{data.comings}</strong>
            </Grid.Column>

            <Grid.Column textAlign="center">
                <Header sub>Приходы в день</Header>
                <strong>{data.comings_in_day || 0}</strong>
            </Grid.Column>

            <Grid.Column textAlign="center">
                <Header sub>КПД</Header>
                <strong>{(data.efficiency || 0).toFixed(2)}%</strong>
            </Grid.Column>

        </Grid>
    </div>
}

export default CrmStat;
