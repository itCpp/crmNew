import React from 'react'
import axios from './../../../utils/axios'
import { connect } from 'react-redux'
import { setDateStart, setDateStop } from '../../../store/adCenter/actions'

import { Loader, Segment, Header } from 'semantic-ui-react';

import './../../../css/ad-center.css'

import Tabs from './Tabs'
import RequestsList from './RequestsList'
import VisitList from './VisitList'

function AdCenter() {

    const [loading, setLoading] = React.useState(false);

    const [loadingSites, setLoadingSites] = React.useState(true);
    const [errorSites, setErrorSites] = React.useState(null);

    const [loadingTabs, setLoadingTabs] = React.useState(false);
    const [errorTabs, setErrorTabs] = React.useState(null);

    const [sites, setSites] = React.useState([]);
    const [site, setSite] = React.useState(false);

    const [tabs, setTabs] = React.useState([]);
    const [active, setActive] = React.useState(null); // Выбранная компания
    const [activeUpdate, setActiveUpdate] = React.useState(false); // Выбранная компания

    const [maxHeight, setMaxHeight] = React.useState("100%");

    /** Загрузка списка сайтов */
    React.useEffect(() => {

        setLoadingSites(true);

        axios.post('admin/getAdSites').then(({ data }) => {

            setSites(data.sites);
            setErrorSites(null);

            if (data.sites[0])
                setSite(data.sites[0]);

        }).catch(error => {
            setErrorSites(axios.getError(error));
        }).then(() => {
            setLoading(false);
            setLoadingSites(false);
        });

        const header = document.getElementById('header-menu');
        setMaxHeight(`calc(100% - ${header.offsetHeight}px)`);

    }, []);

    /** Загрузка списка плашек */
    React.useEffect(() => {

        if (site) {

            setLoadingTabs(true);

            axios.post('admin/getAdTabs', {
                site
            }).then(({ data }) => {
                setTabs(data.rows);
                setErrorTabs(null);
            }).catch(error => {
                setErrorTabs(axios.getError(error));
            }).then(() => {
                setLoadingTabs(false);
            });

        }

    }, [site]);

    if (loading) {
        return <div className="loading-data">
            <Loader active inline="centered" indeterminate size="small" />
        </div>
    }

    const page = active
        ? <div className="d-flex justify-content-between flex-fill align-items-stretch">

            <RequestsList
                active={active}
                activeUpdate={activeUpdate}
            />

            <VisitList
                active={active}
                activeUpdate={activeUpdate}
            />

        </div>
        : <div className="text-center pt-2 px-3 flex-fill">
            <Segment placeholder className="mx-auto">
                <Header>
                    Выберите идентификатор рекламной компании в левом меню
                </Header>
            </Segment>
        </div>

    return <div className="d-flex flex-grow-1" style={{ maxHeight }}>

        <Tabs
            tabs={tabs}
            setActive={setActive}
            setActiveUpdate={setActiveUpdate}
            site={site}
            sites={sites}
            setSite={setSite}
            setSites={setSites}
            loadingData={loadingSites}
            loadingTabs={loadingTabs}
            errorSites={errorSites}
            errorTabs={errorTabs}
            setTabs={setTabs}
        />

        {page}

    </div>

}

const mapStateToProps = state => {
    return {
        dateStart: state.adCenter.dateStart,
        dateStop: state.adCenter.dateStop,
    }
}

const mapDispatchToProps = {
    setDateStart, setDateStop,
}

export default connect(mapStateToProps, mapDispatchToProps)(AdCenter)