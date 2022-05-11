import React from "react";
import { DualAxes } from '@antv/g2plot';
import moment from "moment";

const CounterChart = props => {

    const { columns, lines, color } = props;

    const div = React.useRef();
    const plot = React.useRef();
    const [rows, setRows] = React.useState([columns, lines]);

    React.useEffect(() => {

        if (JSON.stringify([columns, lines]) !== JSON.stringify(rows)) {
            setRows([columns, lines]);
        }

    }, [columns, lines]);

    React.useEffect(() => {

        if (!plot.current) {

            plot.current = new DualAxes(div.current, {
                data: rows,
                xField: 'date',
                yField: ['count', 'count'],
                geometryOptions: [
                    {
                        geometry: 'column',
                        columnWidthRatio: 0.4,
                    },
                    {
                        geometry: 'line',
                        seriesField: 'name',
                    },
                ],
                xAxis: {
                    tickCount: 5,
                    label: {
                        formatter: date => moment(date).format("DD.MM.YYYY"),
                    }
                },
                // yAxis: {
                //     range: [0, 1],
                // },
                tooltip: {
                    formatter: (datum) => {
                        return {
                            name: datum.name || "Кол-во",
                            value: datum.count,
                            title: moment(datum.date).format("DD.MM.YYYYY")
                        };
                    },
                },
                height: 200,
                color: color || '#a8ddb5',
            });

            plot.current.render();

        } else {
            plot.current && plot.current.update({
                data: rows,
            });
        }

    }, [rows]);

    return <div ref={div}></div>
};

export default CounterChart;