import React from "react";
import ChartEfficiency from "./ChartEfficiency";

const RatingCharts = props => {

    const { data } = props;

    return <>

        {data.efficiency && <ChartEfficiency data={data.efficiency || []} />}

    </>

};

export default RatingCharts;