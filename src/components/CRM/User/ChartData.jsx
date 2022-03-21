import React from "react";
import { Area } from '@antv/g2plot';
import moment from "moment";

const Chart = ({ data, title, color, height, update }) => {

    const div = React.useRef();
    const plot = React.useRef();
    const [rows, setRows] = React.useState(data);

    React.useEffect(() => {
        if (update && typeof update == "object") {
            let date = moment().format("YYYY-MM-DD");
            setRows(prev => {
                let rows = [...prev];
                rows.forEach((row, i) => {
                    if (row.date === date) {
                        rows[i].count += update.count;
                    }
                });
                return rows;
            });
        }
    }, [update]);

    React.useEffect(() => {

        if (!plot.current) {

            plot.current = new Area(div.current, {
                data: rows,
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
                height: height || 200,
                color: color || '#a8ddb5',
            });

            plot.current.render();

        } else {
            plot.current && plot.current.changeData(rows);
        }

    }, [rows]);

    return <div ref={div}></div>

}

export default Chart;
