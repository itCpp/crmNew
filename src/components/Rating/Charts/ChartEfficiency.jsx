import React from "react";
import { Column } from '@antv/g2plot';

const ChartEfficiency = props => {

    const { data, comings, agreemetns } = props;
    const plot = React.useRef();
    const block = React.useRef();

    React.useEffect(() => {

        if (!plot.current) {

            plot.current = new Column(block.current, {
                data,
                isGroup: true,
                xField: "pin",
                yField: "value",
                seriesField: "type",
                columnBackground: {
                    style: {
                        fill: 'rgba(0,0,0,0.1)',
                    },
                },
                color: ({ type }) => {

                    if (type === "comings" || type === "КПД приходов")
                        return "#9b1818";

                    return "#0aae18";
                },
                height: 250,
                tooltip: {
                    formatter: (datum) => {
                        return {
                            name: datum.type,
                            value: `${datum.value}%`,
                        };
                    },
                },
                legend: false,
                xAxis: {
                    label: {
                        formatter: data => String(data).replace(/[^0-9]/gi, ''),
                    }
                },
            });

            // plot.current.on('click', console.log)
            plot.current.render();

        } else {
            plot.current && plot.current.changeData(data);
        }

    }, [data]);

    return <div className="rating-callcenter-row" style={{ display: data.length > 2 ? "block" : "none" }}>

        <h5>КПД приходов и договоров</h5>

        <div ref={block}></div>

    </div>

}

export default ChartEfficiency;