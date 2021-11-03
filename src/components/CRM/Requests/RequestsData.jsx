import React from "react";
import axios from "./../../../utils/axios-header";
import { connect } from "react-redux";
import { LIMIT_ROWS_PAGE, setRequests } from "./../../../store/requests/actions";

import { Loader } from "semantic-ui-react";

import RequestsDataTable from "./RequestsDataTable";

const RequestData = React.memo(props => {

    const { select } = props;
    const { setRequests } = props;

    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        setPage(1);
    }, [select]);

    React.useEffect(() => {

        const getRequest = (params) => {

            if (params.page === 1 && !loading)
                setLoading(true);

            axios.post('requests/get', params)
                .then(({ data }) => {
                    setRequests(data.requests);
                })
                .catch(error => {

                })
                .then(() => {
                    setLoading(false);
                });

        }

        if (page) {
            getRequest({
                page,
                limit: LIMIT_ROWS_PAGE,
                tabId: select,
            });
        }

    }, [select, page]);

    return <div id="requests-block">

        <div className="block-card my-3 px-2">

            {loading && select &&
                <div className="text-center my-4 w-100"><Loader active inline indeterminate /></div>
            }

            {!loading && select && <RequestsDataTable />}

        </div>

    </div>

});

const mapStateToProps = state => ({
    // requests: state.requests.requests,
    select: state.requests.select,
    tabs: state.requests.tabs,
});

const mapActionsToProps = {
    setRequests,
}

export default connect(mapStateToProps, mapActionsToProps)(RequestData);