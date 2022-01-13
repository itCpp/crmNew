import React from "react";
// import { axios } from "./../../../../utils";
import moment from "moment";

export const TapeTimes = props => {

    const { title } = props;

    const [data, setData] = React.useState(props.data);
    const canvas = React.useRef();
    const block = React.useRef();

    const resizeCanvas = () => {

        if (!canvas.current || !block.current) return;

        canvas.current.width = data.percent
            ? block.current.offsetWidth * (data.percent / 100)
            : block.current.offsetWidth;

        canvas.current.height = 15;

        draw(data);

    }

    const draw = data => {

        if (canvas.current && canvas.current.getContext) {

            var ctx = canvas.current.getContext('2d'),
                w = data.percent
                    ? block.current.offsetWidth * (data.percent / 100)
                    : block.current.offsetWidth;

            ctx.fillStyle = "#f3f3f3";
            ctx.fillRect(0, 0, w, 15);

            data.rows.forEach(row => {

                if (typeof row.logined != "undefined" && !row.logined) {

                    if (row.color === "red")
                        ctx.fillStyle = "#ed7575";
                    else if (row.color === "green")
                        ctx.fillStyle = "#48d369";
                    else if (row.color === "yellow")
                        ctx.fillStyle = "#fcdd7f";
                    else if (row.color === "grey")
                        ctx.fillStyle = "#ededed";

                } else {

                    if (row.color === "red")
                        ctx.fillStyle = "#db2828";
                    else if (row.color === "green")
                        ctx.fillStyle = "#21ba45";
                    else if (row.color === "yellow")
                        ctx.fillStyle = "#fbbd08";
                    else if (row.color === "grey")
                        ctx.fillStyle = "#ededed";

                }

                let width = w * (row.percent / 100);

                ctx.fillRect(width, 0, w, 15);
            });

        }

    }

    React.useEffect(() => {

        if (typeof data != "object") return;

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        }

    }, [data]);

    return <div ref={block}>

        {title && <h5 className="mb-1">{title}</h5>}

        <div className="tape-time-laps">
            <canvas ref={canvas} />
        </div>

        {data.rows && data.rows.length > 0 && <div className="d-flex justify-content-between opacity-50">
            <small>{data.start && moment(data.start).format("HH:mm")}</small>
            <small>{data.stop && moment(data.stop).format("HH:mm")}</small>
        </div>}

    </div>

}

export default TapeTimes;