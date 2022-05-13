import React from "react";
import { Button, Label } from "semantic-ui-react";

const CounterFlash = props => {

    const { notProcessed, setSelect } = props;

    const interval = React.useRef();
    const btnNull = React.useRef();
    const intervalBtnNull = React.useRef();

    const [scrollShow, setScrollShow] = React.useState(false);
    const [btnNullFlash, setBtnNullFlash] = React.useState(false);

    const checkScroll = React.useCallback(() => {
        const scrollBtn = document.querySelector('button#btn-request-scroll-top.btn-scrolll-top.showBtn');
        setScrollShow(Boolean(scrollBtn));
    }, []);

    const handleBtnNullFlash = () => setBtnNullFlash(f => !f);

    React.useEffect(() => {

        interval.current = setInterval(checkScroll, 500);

        if (Boolean(notProcessed)) {
            intervalBtnNull.current = setInterval(handleBtnNullFlash, 1000);
        } else {
            setBtnNullFlash(false);
        }

        if (btnNull.current) {

            if (Boolean(notProcessed)) {
                btnNull.current.style.transform = "translateX(0)";
            } else {
                btnNull.current.style.transform = "translateX(100px)";
            }
        }

        return () => {
            interval.current && clearInterval(interval.current);
            intervalBtnNull.current && clearInterval(intervalBtnNull.current);
        }

    }, [notProcessed]);

    React.useEffect(() => {

        if (btnNull.current && Boolean(notProcessed)) {

            if (scrollShow) {
                btnNull.current.style.transform = "translateY(-40px)";
            } else {
                btnNull.current.style.transform = "translateY(0)";
            }
        }

    }, [scrollShow]);

    return <>

        <span className="counter-flash-button" ref={btnNull}>

            <Button
                color={btnNullFlash ? "red" : null}
                circular
                className="m-0"
                icon="user plus"
                size="big"
                title="Необходимо назначить оператора"
                onClick={() => setSelect(1)}
            />

            {Boolean(notProcessed) && <Label
                content={notProcessed}
                circular
                color="orange"
                size="mini"
                style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                }}
            />}
        </span>

    </>
}

export default CounterFlash;