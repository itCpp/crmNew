import React from "react";
import axios from "./../../../utils/axios-header";
import { connect } from "react-redux";
import { LIMIT_ROWS_PAGE, setRequests, selectTab } from "./../../../store/requests/actions";

import { Loader, Message } from "semantic-ui-react";

import RequestEdit from "./RequestEdit/RequestEdit";
import RequestsTitle from "./RequestsTitle/RequestsTitle";
import RequestsDataTable from "./RequestsDataTable";

const RequestData = React.memo(props => {

    const { select, selectTab } = props;
    const { searchRequest } = props;
    const { setRequests } = props;
    const { requestEdit } = props;

    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(1);

    const search = searchRequest && Object.keys(searchRequest).length > 0;

    React.useEffect(() => {
        setPage(1);
    }, [select]);

    const getRequests = (params) => {

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

    React.useEffect(() => {

        if (page && Number(select) > 0) {
            getRequests({
                page,
                limit: LIMIT_ROWS_PAGE,
                tabId: select,
            });
        }
        else if (page && Number(select) === 0 && searchRequest) {
            getRequests({
                page,
                limit: LIMIT_ROWS_PAGE,
                tabId: select,
                search: searchRequest,
            });
        }

    }, [select, page]);

    React.useEffect(() => {
        if (search) {
            selectTab(0);
        }
    }, [search]);

    return <div id="requests-block">

        {requestEdit && <RequestEdit />}

        <RequestsTitle getRequests={getRequests} />

        <div className="block-card mb-3 px-2">

            {loading && (select || select === 0) &&
                <div className="text-center my-4 w-100"><Loader active inline indeterminate /></div>
            }

            {!select && select !== 0 && <div style={{ maxWidth: 666, width: '100%' }} className="mx-auto">
                <Message info content="Выберите нужную вкладку слева" />
            </div>}

            {!loading && (select || select === 0) && <RequestsDataTable />}

        </div>

    </div>

});

const mapStateToProps = state => ({
    select: state.requests.select,
    tabs: state.requests.tabs,
    requestEdit: state.requests.requestEdit,
    searchRequest: state.requests.searchRequest,
});

const mapActionsToProps = {
    setRequests, selectTab
}

export default connect(mapStateToProps, mapActionsToProps)(RequestData);