import React from "react";
import { Area } from '@antv/g2plot';
import moment from "moment";

const Chart = ({ data, title, color }) => {

    const div = React.useRef();
    const plot = React.useRef();

    React.useEffect(() => {

        plot.current = new Area(div.current, {
            data,
            xField: 'date',
            yField: 'count',
            xAxis: {
                tickCount: 5,
                label: {
                    formatter: date => moment(date).format("DD.MM.YYYY"),
                }
            },
            yAxis: {
                range: [0, 1],
            },
            tooltip: {
                formatter: (datum) => {
                    return {
                        name: title || "Кол-во",
                        value: datum.count,
                        title: moment(datum.date).format("DD.MM.YYYYY")
                    };
                },
            },
            height: 300,
            color: color || '#a8ddb5',
        });

        plot.current.render();

    }, []);

    return <div ref={div}></div>

}

export default Chart;
