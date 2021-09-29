import React from "react";
import axios from "./../../utils/axios-header";

import { connect } from 'react-redux';
import { setTabList, selectTab } from "./../../store/requests/actions";
import { setTopMenu } from "./../../store/interface/actions";

import { Loader, Message } from "semantic-ui-react";

import "./requests.css";

import RequestsTabs from "./RequestsTabs";
import RequestsTable from "./RequestsTable";

function Requests(props) {

    const { setTabList, selectTab, setTopMenu } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [selectMenu, setSelectMenu] = React.useState([]);

    const openSubMenu = name => {

        let points = [...selectMenu];
        let key = points.indexOf(name);

        if (key >= 0)
            points.splice(key, 1);
        else
            points.push(name);

        setSelectMenu(points);

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

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

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
                <RequestsTabs {...props} openSubMenu={openSubMenu} selectMenu={selectMenu} />
            </div>
        </div>

        <RequestsTable />

    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
});

const mapActions = {
    setTabList, selectTab, setTopMenu
}

export default connect(mapStateToProps, mapActions)(Requests);