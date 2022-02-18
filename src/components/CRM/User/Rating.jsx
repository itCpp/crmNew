import React from "react";
import { Grid, Icon } from "semantic-ui-react";
import { Segment } from "./../UI";

const Rating = ({ data }) => {

    return <Grid.Row columns={5}>
        <Grid.Column>
            <Segment className="d-flex justify-content-between align-items-center">
                <div>
                    <Icon name="list alternate" size="huge" />
                </div>
                <div className="w-100">
                    <div><strong>Заявки</strong></div>
                    <pre className="pre-data" title="Всего / Московские">{data.requestsAll || 0}/{data.requests || 0}</pre>
                </div>
            </Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment className="d-flex justify-content-between align-items-center">
                <div>
                    <Icon name="child" size="huge" />
                </div>
                <div className="w-100">
                    <div><strong>Приходы</strong></div>
                    <pre className="pre-data">{data.comings || 0}</pre>
                </div>
            </Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment className="d-flex justify-content-between align-items-center">
                <div>
                    <Icon name="chart bar" size="huge" />
                </div>
                <div className="w-100">
                    <div><strong>Место в рейтинге</strong></div>
                    <pre className="pre-data">{data.place || 0}</pre>
                </div>
            </Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment className="d-flex justify-content-between align-items-center">
                <div>
                    <Icon name="percent" size="huge" />
                </div>
                <div className="w-100">
                    <div><strong>КПД</strong></div>
                    <pre className="pre-data">{data.efficiency || 0}%</pre>
                </div>
            </Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment className="d-flex justify-content-between align-items-center">
                <div>
                    <Icon name="rub" size="huge" />
                </div>
                <div className="w-100">
                    <div><strong>К выплате</strong></div>
                    <pre className="pre-data">{data.salary || 0}</pre>
                </div>
            </Segment>
        </Grid.Column>
    </Grid.Row>;

}

export default Rating;