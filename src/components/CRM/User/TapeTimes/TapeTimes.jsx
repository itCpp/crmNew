import React from "react";
// import { axios } from "./../../../../utils";
import moment from "moment";

export const TapeTimes = props => {

    const { title, interval } = props;

    const [data, setData] = React.useState(props.data);
    const canvas = React.useRef();
    const block = React.useRef();
    const intervalRef = React.useRef();

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

            var ctx = canvas.current.getContext('2d');

            ctx.fillStyle = "#f3f3f3";
            ctx.fillRect(0, 0, block.current.offsetWidth, 15);

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

                let x = block.current.offsetWidth * (row.percent / 100),
                    width = block.current.offsetWidth * (row.width / 100);

                ctx.fillRect(x, 0, width, 15);
            });

        }

    }

    const update = () => {

        setData(data => {

            let prev = { ...data };

            if (prev.startTime > 0 && prev.stopTime > 0) {

                let now = new Date,
                    timestamp = Date.parse(now) / 1000;

                if (timestamp > prev.stopTime)
                    prev.afterStop = now;

                let a = prev.stopTime - prev.startTime,
                    b = (prev.stopTime - prev.startTime) - (prev.stopTime - timestamp),
                    c = (b * 100) / a;

                let percent = c > 100 ? 100 : c;

                if (typeof prev.rows == "object" && prev.rows.length > 0) {
                    let i = prev.rows.length - 1;
                    prev.rows[i].width = percent - prev.rows[i].percent;
                }
            }

            return prev;

        });

    }

    React.useEffect(() => {

        if (interval === true) {
            intervalRef.current = setInterval(update, 1000);
        }

        return () => {
            intervalRef.current && clearInterval(intervalRef.current);
        }

    }, []);

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
            {data.stop && !data.afterStop && <small>{moment(data.stop).format("HH:mm")}</small>}
            {data.afterStop && <small>{moment(data.afterStop).format("HH:mm")}</small>}
        </div>}

    </div>

}

export default TapeTimes;