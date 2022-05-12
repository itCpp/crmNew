import React from "react";
import { Grid } from "semantic-ui-react";
import { axios } from "../../../utils";
import CounterChart from "./CounterChart";

const Counter = props => {

    const getter = React.useRef();

    const [load, setLoad] = React.useState(false);
    const [chart, setChart] = React.useState([]);

    const getCounter = () => {

        if (load) return;

        setLoad(true);

        axios.post('requests/counter').then(({ data }) => {
            setChart(data.chart);
        }).catch(e => {

        }).then(() => {
            setLoad(false);
        });

    }

    React.useEffect(() => {

        getCounter();

        getter.current = setInterval(getCounter, 10000);

        return () => {
            getter.current && clearInterval(getter.current);
        }

    }, []);

    return <div className="pb-3 px-2 w-100">

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Счётчик заявок</h4>
            </div>
        </div>

        <Grid stackable columns={2}>

            {chart.length && chart.map(row => <Grid.Column key={row.id}>
                <div className="block-card">
                    
                    <div className="d-flex align-items-center mb-3">
                        <h5 className="m-0">{row.name}</h5>
                    </div>

                    <CounterChart
                        columns={row.column}
                        lines={row.line}
                    />

                </div>
            </Grid.Column>)}

        </Grid>

    </div>
}

export default Counter;