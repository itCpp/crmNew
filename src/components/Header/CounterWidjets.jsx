import React from "react";
import { useSelector } from "react-redux";
import { Icon, Label, Popup } from "semantic-ui-react";

const CounterWidjets = props => {

    const { records, comings, drains } = useSelector(store => (store?.requests?.counter || {}));

    if (!records && !comings && !drains)
        return null;

    return <div>
        {Boolean(records) && <CounterWidjetRecords data={records} />}
    </div>
}

const CounterWidjetRecordsLabel = ({ data, title, icon }) => <Label
    content={<span>
        <Popup
            content={title}
            trigger={<Icon name={icon || "calendar"} />}
            size="mini"
            inverted
            className="px-3 py-2"
        />
        <span className="mx-1">{data.count}</span>
        <Popup
            content={data.addrs.map(addr => (addr.office)).join(" / ")}
            trigger={<small>{' '}{data.addrs.map(addr => (addr.count)).join("/")}</small>}
            size="mini"
            inverted
            className="px-3 py-2"
        />
    </span>}
    color="yellow"
    className="px-2 py-1 mr-1"
/>

const CounterWidjetRecords = props => {

    const { data } = props;

    return <>

        {Number(data?.today?.count) >= 0 && <CounterWidjetRecordsLabel
            data={data.today}
            title="Записи на сегодня"
            icon="checked calendar"
        />}

        {Number(data?.tomorrow?.count) >= 0 && <CounterWidjetRecordsLabel
            data={data.tomorrow}
            title="Записи на завтра"
            icon="plus calendar"
        />}

    </>
}

export default CounterWidjets;