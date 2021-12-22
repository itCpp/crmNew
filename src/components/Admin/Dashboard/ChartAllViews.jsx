import React from "react";
import moment from "moment";
import AdminContentSegment from "../UI/AdminContentSegment";
import { Line } from '@antv/g2plot';

const ChartAllViews = ({ data, title }) => {

    const div = React.useRef();
    const plot = React.useRef();

    React.useEffect(() => {

        plot.current = new Line(div.current, {
            data,
            isGroup: true,
            xField: 'created_date',
            yField: 'count',
            xAxis: {
                label: {
                    formatter: date => moment(date).format("DD.MM.YY"),
                }
            }
        });

        plot.current.render();

    }, []);

    return <AdminContentSegment className="py-3">
        {title}
        <div ref={div}></div>
    </AdminContentSegment>

}

export default ChartAllViews;