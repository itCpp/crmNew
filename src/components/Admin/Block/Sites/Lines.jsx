import { useRef, useEffect } from "react";
import { Line } from '@antv/g2plot';
import moment from "moment";

export const Lines = ({ data }) => {

    const div = useRef();
    const plot = useRef();
    const rows = data.map(row => {

        let name = row.name;

        if (row.name === "hosts")
            name = "Посетители";
        else if (row.name === "views")
            name = "Просмотры";

        return { ...row, name }
    });

    useEffect(() => {

        if (!plot.current) {

            plot.current = new Line(div.current, {
                data: rows,
                isGroup: true,
                xField: 'date',
                yField: 'value',
                seriesField: 'name',
                height: 250,
                xAxis: {
                    label: {
                        formatter: date => moment(date).format("DD.MM.YY"),
                    }
                },
            });

            plot.current.render();

        }
        else {
            plot.current && plot.current.changeData(rows);
        }

    }, [rows]);

    return <div ref={div}></div>;
}

export default Lines;