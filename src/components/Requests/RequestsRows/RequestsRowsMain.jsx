import React from "react";
import { withRouter } from "react-router";
import axios from "./../../../utils/axios-header";
import { connect } from 'react-redux';
import {
    setTabList,
    selectTab,
    selectedUpdateTab,
    setRequests,
    updateRequestRow,
    // counterUpdate
    LIMIT_ROWS_PAGE,
} from "./../../../store/requests/actions";
import { Loader, Message, Button, Icon, Label } from "semantic-ui-react";

import RequestsTable from "./RequestsTable";
import RequestAdd from "./../RequestAdd";
import RequestSearch from "./../Search/RequestSearch";

const RequestsRowsMain = props => {

    const { select, searchProcess, setSearchProcess } = props;
    const { requests, setRequests } = props;
    const { selectedUpdate, selectedUpdateTab } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [loadPage, setLoadPage] = React.useState(false);

    const [permits, setPermits] = React.useState({});
    const [add, setAdd] = React.useState(false);
    const [tabName, setTabName] = React.useState(false);

    const [paginate, setPaginate] = React.useState({
        page: 1, // Выбранная страница
        pages: null,
        limit: LIMIT_ROWS_PAGE, // Количество строк за один запрос
        tabId: select, // Выбранная вкладка
        search: null,
    });

    /** Смена вкладки или клик по уже выбранной */
    React.useEffect(() => {
        if (selectedUpdate && select) {
            setTabName(props.tabs.find(item => item.id === select));
            getRequests({ ...paginate, page: 1, tabId: select, search: null });
        }
        else {
            setLoading(false);
        }
    }, [selectedUpdate, select]);

    React.useEffect(() => {
        setSearchProcess(paginate.search && Object.keys(paginate.search).length > 0);
    }, [paginate.search]);

    /**
     * Запрос на получение данных по заявкам
     * @param {object} params Данные для запроса
     * @param {null|function} callback Функция обратного вызова
     */
    const getRequests = (params, callback = null) => {

        if (params.page === 1)
            setLoading(true);

        setLoadPage(true);

        axios.post('requests/get', params).then(({ data }) => {

            setError(null); // Обнуление ошибок
            setPermits(data.permits); // Обновление прав

            // Добавление или обнуление имеющихся строк
            let rows = data.page > 1
                ? [...requests, ...data.requests]
                : data.requests;

            setRequests(rows);
            setPaginate({ ...params, pages: data.pages, total: data.total });

            if (typeof callback == "function")
                callback(data);

        }).catch(error => {

            paginate.page === 1
                ? setError(axios.getError(error))
                : axios.toast(error);

        }).then(() => {
            setLoadPage(false);
            setLoading(false);
            selectedUpdateTab(false);
        });
    }

    /**
     * Смена сектора
     * @returns {boolean}
     */
    const changeSector = async formdata => {

        let response = true;

        await axios.post('requests/setSector', formdata).then(({ data }) => {
            props.updateRequestRow(data.request);
        }).catch(error => {
            axios.toast(error, { time: 5000 });
            response = false;
        });

        return response;

    }

    /**
     * Вывод доступных к выбору сектров
     * @returns {object}
     */
    const findSectors = async formdata => {

        let response = {};

        await axios.post('requests/changeSectorShow', formdata).then(({ data }) => {
            response = { ...data, done: true };
        }).catch(error => {
            response = {
                done: false,
                error: axios.getError(error),
            }
        });

        return response;

    }

    return <div className="px-3" id="requests-block">

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">

                <h4 className="page-title">Заявки</h4>

                {searchProcess &&
                    <div className="page-title-subox">
                        <Icon name="chevron right" />
                        <span>Поиск</span>
                        {paginate.total && <Label
                            content={paginate.total}
                            size="mini"
                            color="green"
                        />}
                    </div>
                }

                {tabName?.name && !searchProcess &&
                    <div className="page-title-subox">
                        <Icon name="chevron right" />
                        <span>{tabName.name}</span>
                        {paginate?.total > 0 && !loading && <Label
                            content={paginate.total}
                            size="mini"
                            color="green"
                        />}
                    </div>
                }

            </div>
            <div>
                <RequestSearch
                    getRequests={getRequests}
                    paginate={paginate}
                    setRequests={setRequests}
                />
                {permits.requests_add && <>
                    <Button
                        icon="plus"
                        color="green"
                        circular
                        title="Создать заявку"
                        basic
                        onClick={() => setAdd(true)}
                    />
                    {add && <RequestAdd {...props} permits={permits} setOpen={setAdd} />}
                </>}
            </div>
        </div>

        <div className="block-card mb-3">

            {!select && !error && <div className="my-3 mx-auto w-100" style={{ maxWidth: "550px" }}>
                <Message info content="Выберите вкладку для отображения заявок" className="mx-1" />
            </div>}

            {loading && select &&
                <div className="text-center my-4 w-100"><Loader active inline indeterminate /></div>
            }

            {(!error && requests.length !== 0) && select && !loading &&
                <RequestsTable
                    {...props}
                    select={select}
                    loading={loading}
                    paginate={paginate}
                    getRequests={getRequests}
                    findSectors={findSectors}
                    changeSector={changeSector}
                    loadPage={loadPage}
                    updates={props.updates}
                />
            }

            {!loading && select && !error && requests.length === 0 && <div className="text-center">
                <div className="my-4" style={{ opacity: "0.4", fontWeight: 500 }}>
                    <Icon name="database" style={{
                        margin: "1rem 0 0",
                        fontSize: "3rem",
                        opacity: 0.2,
                    }} />
                    <div>{paginate.search ? "Ничего не найдено" : "Заявок нет"}</div>
                </div>
            </div>}

            {error && !loading && <div className="my-3 mx-auto w-100" style={{ maxWidth: "550px" }}>
                <Message error content={error} className="mx-1" />
            </div>}

        </div>

    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
    select: state.requests.select,
    selectedUpdate: state.requests.selectedUpdate,
    requests: state.requests.requests,
    requestsIds: state.requests.requestsIds,
    updates: state.requests.updates,
    tabs: state.requests.tabs,
});

const mapActionsToProps = {
    setTabList,
    selectTab,
    setRequests,
    updateRequestRow,
    selectedUpdateTab,
    // counterUpdate
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(RequestsRowsMain));