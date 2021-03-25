import { Icon } from 'semantic-ui-react';

export default function ShowCounterCosts(props) {

    if (typeof props.costs != "object")
        return null;

    const costs = props.costs.map((row, i) => {

        return <div key={i} className="counter-row counter-row-cost">
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
                <b className="mr-1">{row.price}</b>
                <span>руб/шт</span>
            </div>
        </div>

    });

    return <div className="mt-4">

        <h4 className="mb-2"><b>Расходы</b></h4>

        {costs}

    </div>

}