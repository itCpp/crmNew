import React from 'react'
import axios from './../../../utils/axios'
import { Loader, Icon, Segment, List, Message } from 'semantic-ui-react'

import RequestListRow from './RequestListRow'

export default function RequestsList(props) {

    const active = props.active;
    const activeUpdate = props.activeUpdate;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [rows, setRows] = React.useState([]);

    /** Загрузка списка заявок */
    React.useEffect(() => {

        if (active && activeUpdate) {

            setLoading(true);
            setRows([]);

            axios.post('admin/getAdRequests', {
                active
            }).then(({ data }) => {
                setRows(data.rows);
                setError(null);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [active, activeUpdate]);

    const list = rows.length
        ? rows.map(row => <RequestListRow key={row.key} row={row} />)
        : !loading
            ? <Message warning size="mini">За сегодня данных еще нет</Message>
            : null

    return <div className="bg-light flex-fill px-1 py-2 overflow-auto" style={{ maxWidth: "50%" }}>

        {error ? <Segment inverted color="red" tertiary size="mini">{error}</Segment> : null}

        <List divided relaxed>
            {list}
        </List>        

        {loading ? <div className="loading-data">
            <Loader active inline="centered" indeterminate size="small" />
        </div> : null}

    </div>

}