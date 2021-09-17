import React from "react";
import axios from "./../../utils/axios-header";

import { connect } from 'react-redux';
import { setTabList, selectTab } from "./../../store/requests/actions";

import { Loader, Message } from "semantic-ui-react";

import "./requests.css";

import RequestsTabs from "./RequestsTabs";
import RequestsTable from "./RequestsTable";

function Requests(props) {

    const { setTabList, selectTab } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {

        setLoading(true);

        let selected;

        if (selected = localStorage.getItem('select_tab'))
            selectTab(Number(selected));

        axios.post('requests/start').then(({ data }) => {

            setError(false);
            setTabList(data.tabs);

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

    return <>
        <RequestsTabs />
        <RequestsTable />
    </>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
});

const mapActions = {
    setTabList, selectTab
}

export default connect(mapStateToProps, mapActions)(Requests);