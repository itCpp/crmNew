import React from "react";
import { Column } from '@antv/g2plot';
import moment from "../../../utils/moment";

const RatingChart = props => {

    const div = React.useRef();
    const plot = React.useRef();
    const [rows, setRows] = React.useState(props.data || []);

    React.useEffect(() => {
        setRows(props.data);
    }, [props.data]);

    React.useEffect(() => {

        if (!plot.current) {

            plot.current = new Column(div.current, {
                data: rows,
                isGroup: true,
                xField: 'date',
                yField: 'value',
                seriesField: 'type',
                xAxis: {
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
                            name: datum.type,
                            value: datum.value,
                            title: moment(datum.date).format(`DD MMMM YYYY, ${moment(datum.date).format('dd').toUpperCase()}`)
                        };
                    },
                },
                colorField: 'type',
                color: ({ type }) => {
                    
                    if (type === "comings" || type === "Приходы")
                        return "#61a200";
                    else if (type === "drains" || type === "Сливы")
                        return "#bd2c2e";

                    return "#4a83b5";
                },
                height: 200,
            });

            plot.current.render();

        } else {
            plot.current && plot.current.changeData(rows);
        }

    }, [rows]);

    return <>

        <div className="divider-header mb-2" style={{ border: "none" }}>
            <h3>Рейтин колл-центра по итогам дня</h3>
        </div>

        <div ref={div}></div>

    </>

}

export default RatingChart;