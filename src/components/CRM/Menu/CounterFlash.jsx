import React from "react";
import { Button } from "semantic-ui-react";

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

        if (Boolean(notProcessed))
            intervalBtnNull.current = setInterval(handleBtnNullFlash, 1000);

        return () => {
            interval.current && clearInterval(interval.current);
            intervalBtnNull.current && clearInterval(intervalBtnNull.current);
        }

    }, []);

    React.useEffect(() => {

        if (btnNull.current && btnNull.current?.ref?.current) {

            if (scrollShow) {
                btnNull.current.ref.current.style.transform = "translateY(-40px)";
            } else {
                btnNull.current.ref.current.style.transform = "translateY(0)";
            }
        }

    }, [scrollShow]);

    return <>

        <Button
            color={btnNullFlash ? "red" : null}
            circular
            className="counter-flash-button"
            icon="user plus"
            size="big"
            title="Необходимо назначить оператора"
            ref={btnNull}
            onClick={() => setSelect(1)}
        />

    </>
}

export default CounterFlash;