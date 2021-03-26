import { Icon } from 'semantic-ui-react';

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
                <div>
                    <b>{pay.summ}</b>
                    <span>руб</span>
                </div>
                <div style={{ minWidth: "50px" }}>
                    <b>{pay.requests}</b>
                </div>
                <div>
                    <b>{pay.price}</b>
                    <span>руб/шт</span>
                </div>
            </div>)
            : null

        return <>
            <div key={i} className="counter-row counter-row-cost">
                <div className="counter-row-title">
                    {row.icon ? <Icon name={row.icon} color={row.color} /> : null}
                    <span>{row.title}</span>
                </div>
                <div>
                    <b>{row.summ}</b>
                    <span>руб</span>
                </div>
                <div style={{ minWidth: "50px" }}>
                    <b>{row.requests}</b>
                </div>
                <div>
                    <b>{row.price}</b>
                    <span>руб/шт</span>
                </div>
            </div>

            {pays}

        </>

    });

    return <div className="mt-4">

        <h4 className="mb-2"><b>Расходы</b></h4>

        {costs}

    </div>

}