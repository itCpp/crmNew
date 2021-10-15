import React from "react";
import axios from "./../../utils/axios-header";

import { connect } from 'react-redux';
import {
    setTabList,
    selectTab,
    selectedUpdateTab,
    updateRequestRow,
    createRequestRow
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

    const createRequestRow = data => {
        props.createRequestRow({ ...data });
    }

    React.useEffect(() => {

        setLoading(true);

        let selected;

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
                .listen('UpdateRequestRow', ({ row }) => props.updateRequestRow(row))
            // .listen('CreatedNewRequest', data => createRequestRow(data))

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

        return () => {
            window.Echo && window.Echo.leave(`App.Requests`);
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
                />
            </div>
        </div>

        {/* <RequestsTable /> */}
        <RequestsRowsMain setSearchProcess={setSearchProcess} />

    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
    tabs: state.requests.tabs,
    select: state.requests.select,
});

const mapActions = {
    setTabList,
    selectTab,
    setTopMenu,
    selectedUpdateTab,
    updateRequestRow,
    createRequestRow
}

export default connect(mapStateToProps, mapActions)(Requests);