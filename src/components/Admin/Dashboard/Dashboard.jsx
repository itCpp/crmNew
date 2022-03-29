import React from "react";
import { Grid, Header } from "semantic-ui-react";
import ChartAllViews from "./ChartAllViews";
import RatingChart from "./RatingChart";
import AdminContentSegment from "../UI/AdminContentSegment";

const Dashboard = props => {

    return <div>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Админпанель"
                subheader="Общая статистика ЦРМ"
            />

            {/* {loading ? <Loader active inline /> : null} */}

        </div>

        <Grid className="mt-3">

            <Grid.Row>
                <Grid.Column>
                    <AdminContentSegment className="m-0">
                        <RatingChart data={props.rating_chart ?? []} />
                    </AdminContentSegment>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2}>

                {props.views && <Grid.Column>
                    <ChartAllViews
                        data={props.views}
                        title={<div className="divider-header mb-4"><h3>Просмотры страниц на сайтах</h3></div>}
                    />
                </Grid.Column>}

                {props.hosts && <Grid.Column>
                    <ChartAllViews
                        data={props.hosts}
                        title={<div className="divider-header mb-4"><h3>Уникальные посетители на сайтах</h3></div>}
                    />
                </Grid.Column>}

            </Grid.Row>

        </Grid>

    </div>

}

export default Dashboard;