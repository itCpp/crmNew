import React from "react";
import axios from "./../../../utils/axios-header";
import { connect } from "react-redux";
import { LIMIT_ROWS_PAGE, setRequests, appendRequests, selectTab } from "./../../../store/requests/actions";

import { Loader, Message } from "semantic-ui-react";

import RequestEdit from "./RequestEdit/RequestEdit";
import RequestsTitle from "./RequestsTitle/RequestsTitle";
import RequestsDataTable from "./RequestsDataTable";

const RequestData = React.memo(props => {

    const { select, selectTab } = props;
    const { searchRequest } = props;
    const { setRequests, appendRequests } = props;
    const { requestEdit } = props;

    const [loading, setLoading] = React.useState(true);
    const [loadPage, setLoadPage] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(null);
    const [error, setError] = React.useState(null);

    const search = searchRequest && Object.keys(searchRequest).length > 0;

    const getRequests = (params) => {

        if (pages && params.page > pages)
            return null;

        if (params.page === 1 && !loading) {
            setLoading(true);
        }

        setLoadPage(true);

        axios.post('requests/get', params)
            .then(({ data }) => {

                if (params.page === 1)
                    setRequests(data.requests);
                else
                    appendRequests(data.requests);

                setPages(data.pages);
                setError(null);

            })
            .catch(error => {
                let message = axios.getError(error);

                if (params.page === 1)
                    setError(message);
                else
                    axios.toast(message, { time: 0 });
            })
            .then(() => {
                setLoading(false);
                setLoadPage(false);
            });

    }

    React.useEffect(() => {

        setError(null);
        setLoading(true);
        setPage(page => page === 1 ? 0 : 1);

    }, [select]);

    React.useEffect(() => {

        if (page && Number(select) > 0 || (page > 1 && Number(select) === 0 && searchRequest)) {
            getRequests({
                page: page,
                limit: LIMIT_ROWS_PAGE,
                tabId: select,
                search: searchRequest,
            });
        }

    }, [page]);

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

            {!loading && !select && select !== 0 && <div style={{ maxWidth: 666, width: '100%' }} className="mx-auto">
                <Message info content="Выберите нужную вкладку слева" />
            </div>}

            {!loading && error && <div style={{ maxWidth: 666, width: '100%' }} className="mx-auto">
                <Message error content={error} />
            </div>}

            {!loading && (select || select === 0) && !error &&
                <RequestsDataTable
                    setPage={setPage}
                    loadPage={loadPage}
                />
            }

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
    setRequests, appendRequests, selectTab
}

export default connect(mapStateToProps, mapActionsToProps)(RequestData);