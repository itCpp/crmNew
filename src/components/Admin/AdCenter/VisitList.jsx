import React from 'react'
import axios from './../../../utils/axios'
import { connect } from 'react-redux'

import { Loader, Segment, List, Message } from 'semantic-ui-react'

import VisitListRow from './VisitListRow'

function VisitList(props) {

    const active = props.active;
    const activeUpdate = props.activeUpdate;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(1);

    /** Загрузка списка заявок */
    React.useEffect(() => {

        if (active && activeUpdate) {

            setLoading(true);
            setRows([]);

            axios.post('admin/getAdVisites', {
                active,
                page,
                start: props.dateStart,
                stop: props.dateStop
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
        ? rows.map(row => <VisitListRow key={row.id} row={row} />)
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

const mapStateToProps = state => {
    return {
        dateStart: state.adCenter.dateStart,
        dateStop: state.adCenter.dateStop,
    }
}

export default connect(mapStateToProps)(VisitList)