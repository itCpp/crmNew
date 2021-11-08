import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LIMIT_ROWS_PAGE, setRequests, setSearchRequest, selectTab } from "../../../store/requests/actions";
import { Button, Dropdown, Icon, Form, Label } from "semantic-ui-react";

const RequestsSearch = React.memo(props => {

    const { getRequests } = props;
    const dispatch = useDispatch();
    const { searchRequest } = useSelector(state => state.requests);

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState({});
    const [start, setStart] = React.useState(false);
    const [active, setActive] = React.useState(false);

    const close = React.useCallback(() => setOpen(false), []);

    const onChange = (e, { name, value }) => {

        let params = { ...search, [name]: value };

        if (params[name] === "")
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

    const searchCansel = React.useCallback(() => {
        let tabId = Number(localStorage.getItem('select_tab'));

        setOpen(false);
        setSearch({});

        dispatch(selectTab(tabId > 0 ? tabId : null));
        dispatch(setRequests([]));
        dispatch(setSearchRequest(null));
    }, []);

    React.useEffect(() => {

        if (open) {
            document.addEventListener('click', close);
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

            if (typeof search == "object" && Object.keys(search).length > 0)
                getRequests({ search: search, page: 1, tabId: 0, limit: LIMIT_ROWS_PAGE });
        }

        return () => setStart(false);

    }, [start]);

    React.useEffect(() => {

        if (!searchRequest && Object.keys(search).length > 0)
            setSearch({});

    }, [searchRequest]);

    return <Dropdown
        floating
        trigger={<>
            <Button
                icon="search"
                circular
                title="Поиск"
                basic
                onClick={() => setOpen(true)}
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
        open={open}
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

            <div className="search-form">

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

                {searchRequest &&
                    <Button
                        color="orange"
                        content="Отменить поиск"
                        onClick={() => searchCansel()}
                    />
                }

                <Button
                    color="green"
                    content="Найти"
                    onClick={() => setStart(true)}
                    disabled={!active}
                />

            </div>

        </Dropdown.Menu>
    </Dropdown>

});

export default RequestsSearch;
