import React from 'react';
import axios from './../../../../utils/axios-header';
import { Loader, Message } from 'semantic-ui-react'

function Gates() {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [gates, setGates] = React.useState([]);

    React.useEffect(() => {

        axios.post('/gates/getGates').then(({ data }) => {
            setGates(data.gates);
            setError(false);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const rows = loading
        ? <Loader active inline="centered" indeterminate size="small" className="mt-3" />
        : gates.map(gate => <div key={gate.id}>
            <div className="gates-menu-point">{gate.ip}</div>
        </div>);

    if (error)
        return <Message negative className="gates-error">{error}</Message>

    return rows

}

export default Gates;