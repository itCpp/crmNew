import { useEffect, useState } from "react";
import axios from "./../../../../utils/axios-header";
import { Header, Loader, Message } from "semantic-ui-react";

import DistributionCallsRow from "./DistributionCallsRow";
import DistributionCallsSetting from "./DistributionCallsSettings";

const DistributionCalls = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    useEffect(() => {

        axios.post('admin/getDistributionCalls').then(({ data }) => {
            setRows(data.rows);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div style={{ maxWidth: 900 }}>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Распределение звонков"
                subheader="Настройка распределение звонков между секторами"
            />

        </div>

        <div className="admin-content-segment">

            {loading && <Loader inline="centered" active />}
            {!loading && error && <Message error content={error} />}

            {rows && rows.length > 0 && <div>
                {rows.map(row => <DistributionCallsRow key={row.id} row={row} />)}
            </div>}

        </div>

        <DistributionCallsSetting rows={rows} setRows={setRows} />

    </div>

}

export default DistributionCalls;