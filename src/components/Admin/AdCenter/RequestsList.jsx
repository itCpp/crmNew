import React from 'react'
import axios from './../../../utils/axios'
import { connect } from 'react-redux'
import {
    setCountRequestsCall,
    setCountRequestsText,
    setCountRequestsLoading,
    setIpListRequests
} from '../../../store/adCenter/actions'

import { Loader, Segment, List, Message } from 'semantic-ui-react'

import RequestListRow from './RequestListRow'

function RequestsList(props) {

    const active = props.active;
    const activeUpdate = props.activeUpdate;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(1);

    // console.log(props.dateStart, props.dateStop)

    /** Загрузка списка заявок */
    React.useEffect(() => {

        if (active && activeUpdate) {

            setLoading(true);
            setRows([]);
            props.setCountRequestsLoading(true);
            props.setIpListRequests([]);

            axios.post('admin/getAdRequests', {
                active,
                page,
                start: props.dateStart,
                stop: props.dateStop
            }).then(({ data }) => {

                setRows(data.rows);
                setError(null);

                props.setCountRequestsCall(data.countCall);
                props.setCountRequestsText(data.countText);
                props.setIpListRequests(data.iplist);

            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
                props.setCountRequestsLoading(false);
                props.setActiveUpdate(false);
            });

        }

    }, [active, activeUpdate]);

    const list = rows.length
        ? rows.map(row => <RequestListRow key={row.key} row={row} />)
        : !loading
            ? <Message warning size="mini">За сегодня данных еще нет</Message>
            : null

    return <div className="bg-light flex-fill px-1 py-2 overflow-auto" style={{ maxWidth: "50%", maxHeight: props.maxHeight }}>

        {error ? <Segment inverted color="red" tertiary size="mini">{error}</Segment> : null}

        <List divided relaxed>
            {list}
        </List>

        {loading ? <div className="loading-data">
            <Loader active inline="centered" indeterminate size="small" />
        </div> : null}

    </div>

}

const mapStateToProps = state => ({
    dateStart: state.adCenter.dateStart,
    dateStop: state.adCenter.dateStop,
})

const mapDispatchToProps = {
    setCountRequestsCall, setCountRequestsText, setCountRequestsLoading, setIpListRequests
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestsList)