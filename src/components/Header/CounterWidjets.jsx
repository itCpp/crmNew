import React from "react";
import { useSelector } from "react-redux";
import { Icon, Label, Popup } from "semantic-ui-react";

const CounterWidjets = () => {

    const { records, comings, drains } = useSelector(store => (store?.requests?.counter || {}));

    if (!records && !comings && !drains)
        return null;

    return <div>
        {Boolean(records) && <CounterWidjetRecords data={records} />}
        {Boolean(comings) && <CounterWidjetLabel
            data={comings}
            title="Приходы"
            icon="child"
            color="green"
        />}
        {Boolean(drains) && <CounterWidjetLabel
            data={drains}
            title="Сливы"
            icon="bath"
            color="red"
        />}
    </div>
}

const CounterWidjetLabel = ({ data, title, icon, color }) => <Label
    color={color}
    content={<span>
        {icon && <Popup
            content={title}
            trigger={<Icon name={icon} className="mr-1" />}
            size="mini"
            inverted
            className="px-3 py-1"
        />}
        <span className="mr-1">{data.count}</span>
        {data.addrs.length > 1 && <Popup
            content={data.addrs.map(addr => (addr.office)).join(" / ")}
            trigger={<small className="mr-1">{data.addrs.map(addr => (addr.count)).join("/")}</small>}
            size="mini"
            inverted
            className="px-3 py-1"
        />}
    </span>}
    className="px-1 py-1 mr-1"
/>

const CounterWidjetRecords = props => {

    const { data } = props;

    return <>

        {Number(data?.today?.count) >= 0 && <CounterWidjetLabel
            data={data.today}
            title="Записи на сегодня"
            icon="checked calendar"
            color="yellow"
        />}

        {Number(data?.tomorrow?.count) >= 0 && <CounterWidjetLabel
            data={data.tomorrow}
            title="Записи на завтра"
            icon="plus calendar"
            color="yellow"
        />}

    </>
}

export default CounterWidjets;