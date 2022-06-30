import React from "react";
import axios from "./../../utils/axios-header";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
    setTabList,
    selectTab,
    selectedUpdateTab,
    updateRequestRow,
    createRequestRow,
    dropRequestRow,
    counterUpdate,
    setStartData
} from "./../../store/requests/actions";
import { setUserPermits } from "./../../store/actions";
import { setTopMenu } from "./../../store/interface/actions";
import { Icon, Loader, Message } from "semantic-ui-react";
import "./crm.css";
import Menu from "./Menu/Menu";
import Requests from "./Requests/Requests";
import User from "./User";
import AudioCalls from "./AudioCalls";

const AgreementClients = React.lazy(() => import("./AgreementClients"));
const Queues = React.lazy(() => import("./Queues"));
const Sms = React.lazy(() => import("./Sms"));
const Rating = React.lazy(() => import("./Rating"));
const RatingInCharts = React.lazy(() => import("../Rating/Charts/RatingInCharts"));
const SecondCalls = React.lazy(() => import("./SecondCalls"));
const Operators = React.lazy(() => import("./Operators"));
const MyTests = React.lazy(() => import("./MyTests"));
const Fines = React.lazy(() => import("./Fines"));
const ConsultationsClients = React.lazy(() => import("./ConsultationsClients"));
const Phoneboock = React.lazy(() => import("./Phoneboock"));
const Counter = React.lazy(() => import("./Counter"));
const CallsLog = React.lazy(() => import("./CallsLog"));
const Chat = React.lazy(() => import("./Chat"));

const CrmContent = React.memo(withRouter(props => {

    const { page, permits } = props;

    if (page === "/queues" && permits.queues_access)
        return <Queues />
    else if (page === "/sms" && permits.sms_access)
        return <Sms />
    else if (page === "/secondcalls" && permits.second_calls_access)
        return <SecondCalls />
    else if (page === "/pins" && permits.rating_access)
        return <Operators update={props.location.key} />
    else if (page === "/rating" && permits.rating_access)
        return <Rating />
    else if (page === "/charts" && permits.rating_access)
        return <RatingInCharts />
    else if (page === "/requests" && permits.requests_access)
        return <Requests />
    else if (page === "/counter" && permits.requests_access)
        return <Counter {...props} />
    else if (page === "/user/:id")
        return <User {...props} />
    else if (page === "/mytests")
        return <MyTests {...props} />
    else if (page === "/agreements" && permits.clients_agreements_access)
        return <AgreementClients {...props} />
    else if (page === "/fines" && permits.user_fines_access)
        return <Fines {...props} />
    else if (page === "/consultations" && permits.clients_consultation_access)
        return <ConsultationsClients {...props} />
    else if (page === "/phoneboock")
        return <Phoneboock {...props} />
    else if (page == "/callslog" && permits.calls_log_access)
        return <CallsLog {...props} />
    else if (page == "/chat")
        return <Chat {...props} />
    else
        return <User {...props} />

}));

const CRM = props => {

    const { user, setTabList, selectTab, setTopMenu, searchRequest } = props;
    const page = props.match.path;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [selectMenu, setSelectMenu] = React.useState([]);
    const [permits, setPermits] = React.useState({});

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

    }, []);

    const getRowForTab = React.useCallback(id => {

        if (searchRequest && Object.keys(searchRequest).length > 0) return;

        axios.post('requests/getRowForTab', {
            id: id,
            tabId: Number(localStorage.getItem('select_tab')) || null,
        }).then(({ data }) => {
            data.row && props.createRequestRow(data.row);
        });

    }, [searchRequest]);

    const updateRequestRowForPin = React.useCallback(data => {

        const { row, drop, own } = data;

        if (drop) {
            axios.toast(null, {
                time: 30000,
                title: "Отмена заявки",
                type: "info",
                description: <p>Заявка <b>#{row}</b> передана другому оператору</p>
            });
            return props.dropRequestRow(row);
        }

        axios.toast(null, {
            time: 30000,
            title: "Новая заявка",
            type: "info",
            description: own ? <p>Заявка <b>#{row}</b> теперь Ваша</p> : <p>Вам назначена новая заявка <b>#{row}</b></p>,
        });

        getRowForTab(row);

    }, [searchRequest]);

    /** Обработка новой заявки */
    const createdNewRequest = React.useCallback(data => {

        console.log(data);
        const { row, result } = data;

        result?.created && getRowForTab(row);

    }, [searchRequest]);

    const createdNewRequestForSector = React.useCallback(data => {

        if (!data.dropCallCenter && !data.dropSector)
            return getRowForTab(data.row);

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

        axios.post('crm/start').then(({ data }) => {

            setError(false);
            setTabList(data.tabs);
            setTopMenu(data.topMenu);

            window.requestPermits = data.permits;
            window.permits = { ...(window.permits || {}), ...data.permits };
            setPermits(data.permits);

            props.setStartData({
                permits: data.permits,
                statuses: data.statuses,
                themes: data.themes,
            });

            setTimeout(() => {
                counterUpdateProcess = false;
                checkCounter();
            }, 500);

            // Информаирование по всем доступным заявкам
            if (
                data.permits.requests_all_my_sector // Все заявки сектора
                || data.permits.requests_all_sectors // Все заявки всех секторов
                || data.permits.requests_all_callcenters // Все заявки всех коллцентров
            ) {

                let echo;

                if (data.permits.requests_all_callcenters)
                    echo = "0.0";
                else if (data.permits.requests_all_sectors && user.callcenter_id)
                    echo = `${user.callcenter_id}.0`;
                else if (user.callcenter_id && user.callcenter_sector_id)
                    echo = `${user.callcenter_id}.${user.callcenter_sector_id}`;

                // Информаирование по всем заявкам всех секторов и/или коллцентров
                if (typeof echo != "undefined" && window.Echo) {
                    window.Echo.private(`App.Requests.All.${echo}`)
                        .listen('Requests\\CreatedNewRequest', createdNewRequest)
                        .listen('Requests\\UpdateRequestRowForSector', createdNewRequestForSector)
                        .listen('Requests\\UpdateRequestRow', updateRequestRow);
                }

                window.forEcho = echo;

            }

            // Информирование по личным заявкам
            window.Echo && window.Echo.private(`App.Requests.${window.userPin}`)
                .listen('Requests\\UpdateRequestRowForPin', updateRequestRowForPin)
                .listen('Requests\\UpdateRequestRow', updateRequestRow)
                .listen('Requests\\NewSmsEvent', data => {
                    axios.toast(null, {
                        time: 0,
                        title: "Входящее СМС",
                        type: "warning",
                        icon: "mail",
                        description: <div>
                            <div className="mb-1">
                                <b title="Номер заявки" className="mr-2">#{data.to_request}</b>
                                <span>{data.phone}</span>
                            </div>
                            {data.client_name && <div className="d-flex">
                                <Icon name="user" disabled />{data.client_name}
                            </div>}
                            <p className="mb-0 mt-0"><i>{data.message}</i></p>
                        </div>
                    });
                });

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

            if (window.forEcho && window.Echo)
                window.Echo.leave(`App.Requests.All.${window.forEcho}`);

            if (window.Echo)
                window.Echo.leave(`App.Requests.${window.userPin}`);

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

    return <div className="d-flex flex-grow-1">

        <Menu />

        <React.Suspense fallback={<div className="mt-4 w-100"><Loader active indeterminate inline="centered" /></div>}>
            <CrmContent page={page} permits={permits} />
        </React.Suspense>

        {/** Модальное окно просмотра записей разговоров */}
        {props.showAudioCalls && <AudioCalls data={props.showAudioCalls} />}

    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
    tabs: state.requests.tabs,
    select: state.requests.select,
    counter: state.requests.counter,
    searchRequest: state.requests.searchRequest,
    showAudioCalls: state.requests.showAudioCalls,
});

const mapActions = {
    setTabList,
    selectTab,
    setTopMenu,
    selectedUpdateTab,
    updateRequestRow,
    createRequestRow,
    dropRequestRow,
    counterUpdate,
    setStartData,
    setUserPermits
}

export default connect(mapStateToProps, mapActions)(CRM);