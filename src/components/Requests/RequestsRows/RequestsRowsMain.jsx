import React from "react";
import { withRouter } from "react-router";
import axios from "./../../../utils/axios-header";
import { connect } from 'react-redux';
import {
    setTabList,
    selectTab,
    selectedUpdateTab,
    setRequests,
    updateRequestRow
} from "./../../../store/requests/actions";
import { Loader, Message, Table, Icon, Button, Grid } from "semantic-ui-react";

import RequestsTable from "./RequestsTable";

const LIMIT_ROWS_PAGE = 20; // Ограничение количества строк на вывод за один запрос

const RequestsRowsMain = props => {

    const { select, selectTab } = props;
    const { requests, setRequests } = props;
    const { selectedUpdate, selectedUpdateTab } = props;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [loadPage, setLoadPage] = React.useState(false);

    const [permits, setPermits] = React.useState({});

    const [paginate, setPaginate] = React.useState({
        page: 1, // Выбранная страница
        limit: LIMIT_ROWS_PAGE, // Количество строк за один запрос
        tabId: select, // Выбранная вкладка
    });

    /** Смена вкладки или клик по уже выбранной */
    React.useEffect(() => {
        if (selectedUpdate) {
            setLoading(true);
            getRequests({ ...paginate, page: 1, tabId: select });
        }
    }, [selectedUpdate, select]);

    /**
     * Запрос на получение данных по заявкам
     * @param {object} params Данные для запроса
     * @param {null|function} callback Функция обратного вызова
     */
    const getRequests = (params, callback = null) => {

        setLoadPage(true);

        axios.post('requests/get', params).then(({ data }) => {

            setError(null); // Обнуление ошибок
            setPermits(data.permits); // Обновление прав

            // Добавление или обнуление имеющихся строк
            let rows = data.page > 1
                ? [...requests, ...data.requests]
                : data.requests;

            setRequests(rows);
            setPaginate({ ...params, pages: data.pages });

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

        <div className="block-card mt-4 mb-3">

            {!select && !error && <div className="my-3 mx-auto w-100" style={{ maxWidth: "550px" }}>
                <Message info content="Выберите вкладку для отображения заявок" className="mx-1" />
            </div>}

            {loading && select && !error &&
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
                />
            }

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
});

const mapActionsToProps = {
    setTabList, selectTab, setRequests, updateRequestRow, selectedUpdateTab
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(RequestsRowsMain));