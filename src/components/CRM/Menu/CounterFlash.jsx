import React from "react";
import { Button, Label } from "semantic-ui-react";

const CounterFlash = props => {

    const { counter, setSelect } = props;

    const showNotProcess = Number(counter?.btnFlashNull?.count || 0);
    const showNotConfirms = Number(counter?.btnRecords?.count || 0);

    const interval = React.useRef();
    const block = React.useRef();

    const [scrollShow, setScrollShow] = React.useState(false);
    const [buttons, setButtons] = React.useState([]);

    const checkScroll = React.useCallback(() => {
        const scrollBtn = document.querySelector('button#btn-request-scroll-top.btn-scrolll-top.showBtn');
        setScrollShow(Boolean(scrollBtn));
    }, []);

    React.useEffect(() => {

        interval.current = setInterval(checkScroll, 500);

        const list = [];

        list.push({
            ...counter.btnRecords,
            show: showNotConfirms > 0,
            color: "yellow",
            icon: "edit",
            title: "Необходимо подтвердить записи",
            tabs: counter.btnRecords?.tabs || null,
        });

        list.push({
            ...counter.btnFlashNull,
            show: showNotProcess > 0,
            icon: "user plus",
            title: "Необходимо назначить оператора",
            tabs: counter.btnFlashNull?.tabs || null,
        });

        setButtons(list);

        return () => {
            interval.current && clearInterval(interval.current);
        }

    }, [showNotProcess, showNotConfirms]);

    React.useEffect(() => {

        if (block.current) {

            if (scrollShow) {
                block.current.style.transform = "translateY(-40px)";
            } else {
                block.current.style.transform = "translateY(0)";
            }
        }

    }, [scrollShow]);

    return <div className={`${buttons.length === 0 && 'd-none'} flash-buttons-block`} ref={block}>
        {buttons.map((row, key) => <Btn
            key={key}
            row={row}
            {...row}
            setSelect={setSelect}
        />)}
    </div>
}

/**
 * Боковая кнопка
 * 
 * @param {object} props 
 * @returns 
 */
const Btn = props => {

    const { row, show, icon, color, title, setSelect } = props;

    const interval = React.useRef();
    const btn = React.useRef();

    const [flash, setFlash] = React.useState(false);

    const handleFlash = React.useCallback(() => {
        setFlash(f => !f);
    }, []);

    React.useEffect(() => {

        if (show) {
            interval.current = setInterval(handleFlash, 1000);
            btn.current.style.display = "block";
            setTimeout(() => { btn.current.style.transform = "translateX(0)"; }, 200);
        } else {
            btn.current.style.transform = "translateX(100px)";
            setTimeout(() => { btn.current.style.display = "none" }, 200);
        }

        return () => {
            interval.current && clearInterval(interval.current);
        }

    }, [show]);

    return <span className="counter-flash-button" ref={btn}>

        <Button
            color={flash ? (color || "red") : null}
            circular
            className="m-0"
            icon={icon || "warning circle"}
            size="big"
            title={title}
            onClick={() => {
                row.tabs && row.tabs.length > 0 && setSelect(row.tabs[0]);
            }}
        />

        {Boolean(row?.count) && <Label
            content={row.count}
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

}

export default CounterFlash;