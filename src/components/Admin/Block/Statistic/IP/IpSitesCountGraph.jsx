import React from "react";
import { Column } from '@antv/g2plot';
import moment from "./../../../../../utils/moment";

export default (({ data }) => {

    const div = React.useRef();
    const plot = React.useRef();

    React.useEffect(() => {

        plot.current = new Column(div.current, {
            data,
            isGroup: true,
            xField: 'date',
            yField: 'value',
            seriesField: 'name',
            xAxis: {
                label: {
                    formatter: date => moment(date).format("DD MMM YY"),
                }
            }
        });

        plot.current.render();

    }, []);

    return <div ref={div}></div>;
});