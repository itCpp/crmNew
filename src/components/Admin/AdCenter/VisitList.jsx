import React from 'react'
import axios from './../../../utils/axios'
import { connect } from 'react-redux'
import { setCountVisitSite, setCountVisitSiteLoading, setIpsAdresses } from '../../../store/adCenter/actions'

import { Loader, Segment, List, Message } from 'semantic-ui-react'

import VisitListRow from './VisitListRow'

function VisitList(props) {

    const active = props.active;
    const activeUpdate = props.activeUpdate;

    const [loading, setLoading] = React.useState(false);
    const [process, setProcess] = React.useState(0);
    const [error, setError] = React.useState(null);

    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [endData, setEndData] = React.useState(false);

    // React.useEffect(async () => {

    //     const block = document.getElementById('visit-sites-list');

    //     const scrollVisitList = e => {

    //         let scrollHeight = e.target.scrollHeight,
    //             scrollTop = e.target.scrollTop,
    //             innerHeight = window.innerHeight;

    //             let countProcess = process;

    //         if (((scrollHeight - (scrollTop + innerHeight)) < 100) && !endData && countProcess === 0) {

    //             console.log(endData, countProcess)

    //             countProcess = process + 1;

    //             if (countProcess === 1)
    //                 setProcess(countProcess);
    //             // console.log((((scrollHeight - (scrollTop + innerHeight)) < 100) && !endData && !process), scrollHeight, scrollTop, innerHeight);
    //         }

    //     }


    //     block.addEventListener('scroll', scrollVisitList);

    //     return () => block.removeEventListener('scroll', scrollVisitList);

    // }, [process]);

    const getAdVisites = async (formdata) => {

        await axios.post('admin/getAdVisites', formdata).then(({ data }) => {

            let newRows = rows.slice();

            data.rows.forEach(row => {
                newRows.push(row);
            });

            setRows(data.rows);
            setPage(data.nextPage);

            if (data.nextPage > data.lastPage)
                setEndData(true);

            setError(null);

            props.setCountVisitSite(data.countVisits);
            props.setIpsAdresses(data.ip);

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }

    /** Загрузка списка заявок */
    React.useEffect(async () => {

        if (active && activeUpdate) {

            setLoading(true);
            setRows([]);
            setPage(1);
            setEndData(false);
            props.setCountVisitSiteLoading(true);

            await getAdVisites({
                active,
                page: 1,
                start: props.dateStart,
                stop: props.dateStop
            });

            props.setCountVisitSiteLoading(false);

        }

    }, [active, activeUpdate]);

    /** Загрузка списка заявок */
    // React.useEffect(() => {

    //     if (process === 1) {

    //         setLoading(true);
    //         console.log("process", process);

    //         getAdVisites({
    //             active,
    //             page,
    //             start: props.dateStart,
    //             stop: props.dateStop
    //         });

    //     }

    //     return () => setProcess(0);

    // }, [process]);

    const list = rows.length
        ? rows.map(row => <VisitListRow key={row.id} row={row} />)
        : !loading
            ? <Message warning size="mini">За сегодня данных еще нет</Message>
            : null

    return <div className="bg-light flex-fill px-1 py-2 overflow-auto" style={{ maxWidth: "50%", maxHeight: props.maxHeight }} id="visit-sites-list">

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
});

const mapDispatchToProps = {
    setCountVisitSite, setCountVisitSiteLoading, setIpsAdresses
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitList)