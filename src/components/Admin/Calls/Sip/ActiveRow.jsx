import React from "react";
import { Icon } from "semantic-ui-react";

const ActiveRow = props => {

    const { row, period } = props;

    const canvas = React.useRef();
    const block = React.useRef();

    const resizeCanvas = () => {

        if (!canvas.current || !block.current) return;

        canvas.current.width = block.current.offsetWidth;
        canvas.current.height = 10;

        draw(row);

    }

    const draw = data => {

        if (canvas.current && canvas.current.getContext) {

            var ctx = canvas.current.getContext('2d'),
                w = canvas.current.offsetWidth;

            ctx.fillStyle = "#f3f3f3";
            ctx.fillRect(0, 0, w, 10);

            data.events.forEach(e => {

                if (e.status === "Start")
                    ctx.fillStyle = "#f36a6a";
                else
                    ctx.fillStyle = "#7fed69";

                let percent = (e.start * 100) / period,
                    width = w * (percent / 100);

                ctx.fillRect(width, 0, w, 10);
            });

        }

    }

    React.useEffect(() => {

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        }

    }, []);

    React.useEffect(() => {
        resizeCanvas(row);
    }, [row, period]);

    return <div className="mb-2" ref={block}>

        <div className="mb-2 mt-1 d-flex justify-content-between">
            <h5 className="mb-0">{row.extension}</h5>
            <span>
                <Icon
                    name="call"
                    color={row.status === "Start" ? "red" : "green"}

                />
            </span>
        </div>

        <div style={{ position: "relative", height: 10 }}>
            <canvas ref={canvas} height="10" style={{
                borderRadius: ".25rem",
                position: "absolute",
            }} />
        </div>

    </div>

}

export default ActiveRow;