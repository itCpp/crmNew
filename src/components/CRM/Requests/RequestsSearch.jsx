import React from "react";
import { withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
    LIMIT_ROWS_PAGE,
    setRequests,
    setSearchRequest,
    selectTab
} from "../../../store/requests/actions";
import { Button, Dropdown, Icon, Form, Label, Dimmer, Loader } from "semantic-ui-react";
import { axios } from "../../../utils";
import { caseSensitiveSearch } from "./RequestEdit/RequestEditForm";

const RequestsSearch = React.memo(props => {

    const { getRequests, history } = props;
    const dispatch = useDispatch();
    const { searchRequest } = useSelector(state => state.requests);

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState(searchRequest || {});
    const [filter, setFilter] = React.useState({});
    const [start, setStart] = React.useState(false);
    const [active, setActive] = React.useState(false);

    const [loadInfo, setLoadInfo] = React.useState(false);
    const [loadInfoDone, setLoadInfoDone] = React.useState(false);
    const [cities, setCities] = React.useState([]);
    const [sources, setSources] = React.useState([]);
    const [statuses, setStatuses] = React.useState([]);
    const [themes, setThemes] = React.useState([]);

    const close = React.useCallback(() => setOpen(false), []);

    const onChange = (e, { name, value }) => {

        let params = { ...search, [name]: value };

        if (params[name] === "" || params[name] === null)
            delete (params[name]);

        setSearch(params);
        setActive(Object.keys(params).length > 0);
    }

    const onKeyUp = e => {

        if (e.keyCode === 32)
            return setSearch(p => ({ ...p, [e.target.name]: e.target.value + " " }));

        if (e.keyCode === 13 && Object.keys(search).length > 0)
            return setStart(true);
    }

    const historyAppend = data => {

        let path = "/requests";
        const searchParams = new URLSearchParams;

        for (let k in data)
            searchParams.append(k, data[k]);

        let search = searchParams.toString();

        if (search)
            path += `?${search}`;

        history.push(path);
    }

    const searchCansel = React.useCallback(() => {

        let tabId = Number(localStorage.getItem('select_tab'));

        setOpen(false);
        setSearch({});
        historyAppend({});

        dispatch(selectTab(tabId > 0 ? tabId : null));
        dispatch(setRequests([]));
        dispatch(setSearchRequest(null));
        // dispatch(requestEditCell(null));
    }, []);

    /** Загрузка данных для вывода полей поиска */
    const loadInfoSearch = React.useCallback(() => {

        setLoadInfo(true);

        axios.get('requests/search/info').then(({ data }) => {
            setCities(data.cities.map((row, i) => ({ key: i, text: row, value: row })));
            setSources(data.sources.map(row => ({ key: row.id, text: row.name, value: row.id })));
            setStatuses(data.statuses.map(row => ({ key: row.id, text: row.name, value: row.id })));
            setThemes(data.themes.map((row, i) => ({ key: i, text: row, value: row })));
        }).catch(() => null).then(() => {
            setLoadInfo(false);
            setLoadInfoDone(true);
        });

    }, []);

    React.useEffect(() => {

        if (open) {
            document.addEventListener('click', close);
            // dispatch(requestEditCell(null));
        }
        else {
            document.removeEventListener('click', close);
        }

    }, [open]);

    React.useEffect(() => {

        if (start) {
            setOpen(false);
            dispatch(setRequests([]));
            dispatch(setSearchRequest(search));

            if (typeof search == "object" && Object.keys(search).length > 0) {
                historyAppend(search);
                getRequests({ search: search, page: 1, tabId: 0, limit: LIMIT_ROWS_PAGE });
            }
        }

        return () => setStart(false);

    }, [start]);

    React.useEffect(() => {

        if (!searchRequest && Object.keys(search).length > 0)
            setSearch({});

    }, [searchRequest]);

    return <>

        <Dropdown
            floating
            trigger={<>
                <Button
                    icon="search"
                    circular
                    title="Поиск"
                    basic
                    onClick={() => setOpen("search")}
                />
                {searchRequest &&
                    <Label
                        color="red"
                        circular
                        empty
                        size="mini"
                        className="button-label-info"
                    />
                }
            </>}
            icon={null}
            pointing="top right"
            open={open === "search"}
            onOpen={() => loadInfoDone === false && loadInfoSearch()}
        >
            <Dropdown.Menu style={{ zIndex: 1000 }}>
                <Dropdown.Header className="d-flex justify-content-between">
                    <div>Поиск</div>
                    <div>
                        <Icon
                            name="close"
                            className="button-icon"
                            onClick={() => setOpen(false)}
                        />
                    </div>
                </Dropdown.Header>

                <Dropdown.Divider />

                <div className="search-form position-relative">

                    <Form.Input
                        type="number"
                        icon="hashtag"
                        iconPosition="left"
                        placeholder="ID"
                        name="id"
                        value={search.id || ""}
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                    />

                    <Form.Input
                        type="text"
                        icon="phone"
                        iconPosition="left"
                        placeholder="Телефон"
                        name="phone"
                        value={search.phone || ""}
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                    />

                    <Form.Input
                        type="text"
                        icon="user"
                        iconPosition="left"
                        placeholder="ФИО"
                        name="fio"
                        value={search.fio || ""}
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                    />

                    <Form.Input
                        type="number"
                        icon="user circle"
                        iconPosition="left"
                        placeholder="PIN"
                        name="pin"
                        value={search.pin || ""}
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                    />

                    <Dropdown
                        placeholder="Регион"
                        options={[{ key: "empty", text: "Любой регион", value: null }, ...cities]}
                        name="region"
                        value={search.region || null}
                        onChange={onChange}
                        selection
                        search={caseSensitiveSearch}
                        noResultsMessage="Регион не найден"
                    />

                    <Dropdown
                        placeholder="Тематика"
                        fluid
                        options={[{ key: "empty", text: "Любая тематика", value: null }, ...themes]}
                        name="theme"
                        value={search.theme || null}
                        onChange={onChange}
                        selection
                        search={caseSensitiveSearch}
                        noResultsMessage="Тематика не найдена"
                    />

                    <Dropdown
                        placeholder="Источник"
                        fluid
                        options={[{ key: "empty", text: "Любой источник", value: null }, ...sources]}
                        name="source"
                        value={search.source || null}
                        onChange={onChange}
                        selection
                        search={caseSensitiveSearch}
                        noResultsMessage="Источник не найден"
                    />

                    <Dropdown
                        placeholder="Статус"
                        fluid
                        options={[{ key: "empty", text: "Любой статус", value: null }, ...statuses]}
                        name="status"
                        value={search.status || null}
                        onChange={onChange}
                        selection
                        search={caseSensitiveSearch}
                        noResultsMessage="Статус не найден"
                    />

                    <Button
                        color="green"
                        content="Найти"
                        onClick={() => setStart(true)}
                        disabled={!active}
                    />

                    {searchRequest &&
                        <Button
                            color="orange"
                            content="Отменить поиск"
                            onClick={() => searchCansel()}
                        />
                    }

                    <Dimmer active={loadInfo} className="rounded" inverted>
                        <Loader />
                    </Dimmer>

                </div>

            </Dropdown.Menu>
        </Dropdown>

    </>

});

export default withRouter(RequestsSearch);
