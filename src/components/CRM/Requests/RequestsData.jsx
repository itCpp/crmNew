import React from "react";
import axios from "./../../../utils/axios-header";
import { connect } from "react-redux";
import {
    LIMIT_ROWS_PAGE,
    setRequests,
    appendRequests,
    selectTab,
    setRequestsLoading
} from "./../../../store/requests/actions";

import { Loader, Message } from "semantic-ui-react";

import RequestEdit from "./RequestEdit/RequestEdit";
import RequestsTitle from "./RequestsTitle/RequestsTitle";
import RequestsDataTable from "./RequestsDataTable";
import RequestSendSms from "./RequestSendSms";

const RequestData = React.memo(props => {

    const { select, selectTab, selectedUpdate } = props;
    const { searchRequest, sendSms } = props;
    const { setRequests, appendRequests, setRequestsLoading } = props;
    const { requestEdit } = props;

    const [loading, setLoading] = React.useState(true);
    const [loadPage, setLoadPage] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [pages, setPages] = React.useState(null);
    const [error, setError] = React.useState(null);

    const search = searchRequest && Object.keys(searchRequest).length > 0;

    const getRequests = (params) => {

        if ((pages && params.page > pages) || loadPage)
            return null;

        if ((params.page === 1 || params.page === 1.1) && !loading)
            setLoading(true);

        setLoadPage(true);

        axios.post('requests/get', params)
            .then(({ data }) => {

                if (params.page === 1 || params.page === 1.1)
                    setRequests(data.requests);
                else
                    appendRequests(data.requests);

                setPages(data.pages);
                setError(null);

                window.requestPermits = data.permits;

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

    /**
     * Думал как сделать обновление вкладки при клике по этой же вкладке
     * Решил использовать неполное число страницы, чтобы заставить
     * срабатывать эффект, завиящий от смены страницы
     */
    React.useEffect(() => {

        setError(null);

        if (select !== null) {
            setLoading(true);
            setRequestsLoading(true);
        }

        setTimeout(() => {
            setPage(page => page === 1 ? 1.1 : 1);
        }, 50);

    }, [select, selectedUpdate]);

    React.useEffect(() => {

        if (Number(select) > 0 || (page > 1 && Number(select) === 0 && searchRequest)) {
            getRequests({
                page: page,
                limit: LIMIT_ROWS_PAGE,
                tabId: select,
                search: searchRequest,
            });
        }

    }, [page, searchRequest]);

    React.useEffect(() => {
        if (search) {
            selectTab(0);
        }
    }, [search]);

    return <div id="requests-block">

        {requestEdit && <RequestEdit />}
        {sendSms && <RequestSendSms />}

        <RequestsTitle getRequests={getRequests} />

        <div className="block-card mb-3 px-2">

            {loading && (select || select === 0) &&
                <div className="text-center my-4 w-100"><Loader active inline indeterminate /></div>
            }

            {select === null && <div style={{ maxWidth: 666, width: '100%' }} className="mx-auto">
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
    selectedUpdate: state.requests.selectedUpdate,
    tabs: state.requests.tabs,
    requestEdit: state.requests.requestEdit,
    searchRequest: state.requests.searchRequest,
    sendSms: state.requests.sendSms,
});

const mapActionsToProps = {
    setRequests, appendRequests, selectTab, setRequestsLoading
}

export default connect(mapStateToProps, mapActionsToProps)(RequestData);