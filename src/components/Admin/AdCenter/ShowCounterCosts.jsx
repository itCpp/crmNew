import { Icon, Popup } from 'semantic-ui-react';

export default function ShowCounterCosts(props) {

    if (typeof props.costs != "object")
        return null;

    const costs = props.costs.map((row, i) => {

        const pays = typeof row.rows == "object"
            ? row.rows.map((pay, key) => <div key={`${i}-${key}`} className="counter-row counter-row-cost counter-row-subcost">
                <div className="counter-row-title">
                    <div className="d-flex align-items-center">
                        <Icon size="mini" name="circle" style={{ paddingTop: ".1rem" }} />
                        <span>{pay.name || pay.compain_id}</span>
                    </div>
                </div>
                <Popup
                    size="mini"
                    content="Потрачено (руб)"
                    position="top center"
                    trigger={<div>
                        <b>{pay.summ}</b>
                    </div>}
                />
                <Popup
                    size="mini"
                    content="Количество заявок"
                    position="top center"
                    trigger={<div style={{ minWidth: "50px" }}>
                        <b>{pay.requests}</b>
                    </div>}
                />
                <Popup
                    size="mini"
                    content="Цена одной заявки (руб/шт)"
                    position="top center"
                    trigger={<div>
                        <b>{pay.price}</b>
                    </div>}
                />
            </div>)
            : null

        return <>
            <div key={i} className="counter-row counter-row-cost">
                <div className="counter-row-title">
                    {row.icon ? <Icon name={row.icon} color={row.color} /> : null}
                    <span>{row.title}</span>
                </div>
                <Popup
                    size="mini"
                    content="Потрачено (руб)"
                    position="top center"
                    trigger={<div>
                        <b>{row.summ}</b>
                    </div>}
                />
                <Popup
                    size="mini"
                    content="Количество заявок"
                    position="top center"
                    trigger={<div style={{ minWidth: "50px" }}>
                        <b>{row.requests}</b>
                    </div>}
                />
                <Popup
                    size="mini"
                    content="Цена одной заявки (руб/шт)"
                    position="top center"
                    trigger={<div>
                        <b>{row.price}</b>
                    </div>}
                />
            </div>

            {pays}

        </>

    });

    return <div className="mt-4">

        <h4 className="mb-2"><b>Расходы</b></h4>

        {costs}

    </div>

}