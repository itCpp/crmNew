import React from "react";
import axios from "./../../utils/axios-header";

import { connect } from 'react-redux';
import {
    setTabList,
    selectTab,
    selectedUpdateTab,
    updateRequestRow,
    createRequestRow,
    dropRequestRow,
    counterUpdate
} from "./../../store/requests/actions";
import { setTopMenu } from "./../../store/interface/actions";

import { Loader, Message } from "semantic-ui-react";

import "./requests.css";

import RequestsTabs from "./RequestsTabs";
// import RequestsTable from "./RequestsTable";
import RequestsRowsMain from "./RequestsRows/RequestsRowsMain";

function Requests(props) {

    const { setTabList, selectTab, setTopMenu } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [selectMenu, setSelectMenu] = React.useState([]);
    const [searchProcess, setSearchProcess] = React.useState(false);

    const openSubMenu = name => {

        let points = [...selectMenu];
        let key = points.indexOf(name);

        if (key >= 0)
            points.splice(key, 1);
        else
            points.push(name);

        setSelectMenu(points);

    }

    const updateRequestRow = React.useCallback(data => {

        if (data.toExclude && data.toExclude.indexOf(window.userPin) >= 0)
            return;

        const { row } = data;
        props.updateRequestRow(row);
        // console.log(data);

    }, []);

    const updateRequestRowForPin = React.useCallback(data => {

        const { row, drop } = data;

        if (drop) {
            axios.toast(null, {
                time: 5000,
                type: "info",
                description: <p>Заявка <b>#{row}</b> передана другому оператору</p>
            });
            return props.dropRequestRow(row);
        }

        axios.toast(null, {
            time: 0,
            type: "info",
            description: <p>Вам назначена новая заявка <b>#{row}</b></p>
        });

        axios.post('requests/getRowForTab', {
            id: row,
            tabId: localStorage.getItem('select_tab')
        }).then(({ data }) => {
            data.row && props.createRequestRow(data.row);
        });

    }, []);

    React.useEffect(() => {

        let selected,
            counterUpdateInterval,
            counterUpdateProcess = true,
            counterUpdateError = false;

        const checkCounter = () => {

            if (counterUpdateProcess || counterUpdateError) return;

            counterUpdateProcess = true;

            axios.post('requests/getCounter').then(({ data }) => {
                props.counterUpdate(data.counter);
            }).catch(() => {
                counterUpdateError = true;
            }).then(() => {
                counterUpdateProcess = false;
            });

        }

        setLoading(true);

        if (selected = localStorage.getItem('select_tab')) {
            selectTab(Number(selected));
            openSubMenu('requests');
        }

        axios.post('requests/start').then(({ data }) => {

            setError(false);
            setTabList(data.tabs);
            setTopMenu(data.topMenu);

            window.requestPermits = data.permits;

            window.Echo && window.Echo.private(`App.Requests`)
                .listen('UpdateRequestRow', updateRequestRow);

            window.Echo && window.Echo.private(`App.Requests.${window.userPin}`)
                .listen('UpdateRequestRowForPin', updateRequestRowForPin);

            if (data.intervalCounter) {
                counterUpdateInterval = setInterval(checkCounter, data.intervalCounter);
                counterUpdateProcess = false;
            }

            props.counterUpdate(data.counter);

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

        return () => {
            window.Echo && window.Echo.leave(`App.Requests`);
            window.Echo && window.Echo.leave(`App.Requests.${window.userPin}`);

            clearInterval(counterUpdateInterval);
        }

    }, []);

    if (loading)
        return <div className="text-center my-4"><Loader active inline /></div>

    if (error) {
        return <div className="my-4 mx-auto w-100" style={{ maxWidth: "550px" }}>
            <Message error content={error} className="mx-1" />
        </div >
    }

    return <div className="d-flex" style={{ flexGrow: 1 }}>

        <div className="bg-request-main-menu"></div>

        <div className="request-main-menu">
            <div className="nav-bar">
                <RequestsTabs
                    {...props}
                    openSubMenu={openSubMenu}
                    selectMenu={selectMenu}
                    searchProcess={searchProcess}
                    counter={props.counter || {}}
                />
            </div>
        </div>

        {/* <RequestsTable /> */}
        <RequestsRowsMain searchProcess={searchProcess} setSearchProcess={setSearchProcess} />

    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
    tabs: state.requests.tabs,
    select: state.requests.select,
    counter: state.requests.counter,
});

const mapActions = {
    setTabList,
    selectTab,
    setTopMenu,
    selectedUpdateTab,
    updateRequestRow,
    createRequestRow,
    dropRequestRow,
    counterUpdate
}

export default connect(mapStateToProps, mapActions)(Requests);