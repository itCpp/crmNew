import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Dimmer, Form, Icon, Loader, Message, Modal, Search } from "semantic-ui-react";
import { setShowFineAdd } from "../../../store/requests/actions";
import { axios } from "../../../utils";

const initialState = {
    searchLoad: false,
    results: [],
    serachError: null,
    value: '',
    pin: null,
    requestId: null,
    fine: 0,
    comment: "",
    setsChiefs: [],
}

function searchReducer(state, action) {

    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialState
        case 'START_SEARCH':
            return { ...state, searchLoad: true, value: action.query, serachError: null }
        case 'FINISH_SEARCH':
            return { ...state, searchLoad: false, results: action.results }
        case 'UPDATE_SELECTION':

            let list = [];

            state.results.forEach(row => {
                if (String(row.pin) === String(action.selection)) {
                    list.push(row);
                }
            });

            return {
                ...state,
                pin: action.selection,
                results: list,
                value: String(action.selection)
            }
        case 'UPDATE_SELECTION_REQUEST':
            return {
                ...state,
                pin: action.pin,
                value: action.pin,
                requestId: action.requestId,
                results: action.results || [],
            }
        case 'ERROR_SEARCH':
            return {
                ...state,
                searchLoad: false,
                results: action.results,
                serachError: action.message
            }
        case "SET_SUM_FINE":
            return { ...state, fine: action.fine }
        case "SET_COMMENT_FINE":
            return { ...state, comment: action.comment }

        case "CHIEF_PUSH":
            if (state.setsChiefs.indexOf(action.pin) < 0) {
                state.setsChiefs.push(action.pin);
            }
            return { ...state }
        case "CHIEF_DROP":
            if (state.setsChiefs.indexOf(action.pin) >= 0) {

                let key = null;

                state.setsChiefs.forEach((row, i) => {
                    if (row === action.pin) {
                        key = i;
                    }
                });

                if (key !== null)
                    state.setsChiefs.splice(key, 1);
            }
            return { ...state }

        default:
            throw new Error()
    }
}

const resultRenderer = (data) => <div className="d-flex align-items-center">
    <strong>{data.pin}</strong>
    <span className="flex-grow-1 mx-2">{data.title}</span>
    <small>@{data.login}</small>
</div>

const FineAdd = () => {

    const { showAddFine } = useSelector(state => state.requests);
    const _dispatch = useDispatch();
    const timeout = React.useRef();

    const [loading, setLoading] = React.useState(false);
    const [loadingError, setLoadingError] = React.useState(null);
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [chiefs, setChiefs] = React.useState([]);

    const [state, dispatch] = React.useReducer(searchReducer, initialState);
    const {
        searchLoad,
        results,
        value,
        serachError,
        requestId,
        fine,
        comment,
        setsChiefs
    } = state;

    const close = React.useCallback(() => _dispatch(setShowFineAdd(null)), []);

    const getData = React.useCallback((param) => {

        setLoading(true);

        axios.post('fines/request', param).then(({ data }) => {

            dispatch({
                type: 'UPDATE_SELECTION_REQUEST',
                pin: String(data.user?.pin),
                requestId: data.request_id,
                results: [data.option]
            });

            setChiefs(data.chiefs);

        }).catch(e => {
            axios.setError(e, setLoadingError);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const onSearchChange = React.useCallback((e, { value }) => {

        timeout.current && clearTimeout(timeout.current);
        dispatch({ type: 'START_SEARCH', query: value });

        timeout.current = setTimeout(() => {

            if (value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' });
                return;
            }

            axios.post('fines/user/find', { search: value }).then(({ data }) => {

                dispatch({
                    type: 'FINISH_SEARCH',
                    results: data.options,
                });

            }).catch(e => {

                dispatch({
                    type: 'ERROR_SEARCH',
                    message: axios.getError(e),
                    results: [],
                });

            });

        }, 300);

    }, []);

    React.useEffect(() => {

        if (showAddFine) {
            typeof showAddFine == "object" && getData(showAddFine);
        }

        return () => {
            setLoadingError(null);
            setLoading(false);
            clearTimeout(timeout.current);
            dispatch({ type: 'CLEAN_QUERY' });
            setSave(false);
            setErrors({});
            setSaveError(null);
            setChiefs([]);
        }

    }, [showAddFine]);

    React.useEffect(() => {

        if (save) {

            axios.put('fines/create', {
                request_id: requestId,
                pin: value,
                chiefs: setsChiefs,
                comment,
                fine,
            }).then(() => {
                _dispatch(setShowFineAdd(null));
                axios.toast("Штраф добавлен", { type: "success" });
            }).catch(e => {
                setErrors(axios.getErrors(e));
                axios.setError(e, setSaveError);
            }).then(() => {
                setSave(false);
            });

        }

    }, [save]);

    return <Modal
        open={showAddFine ? true : false}
        header="Назначить штраф"
        centered={false}
        size="tiny"
        closeIcon={<Icon name="close" disabled={save} onClick={close} />}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        content={<div className="content position-relative">

            <div>

                <Search
                    loading={searchLoad}
                    placeholder="Поиск сотрудника..."
                    onSearchChange={onSearchChange}
                    onResultSelect={(e, data) => dispatch({
                        type: 'UPDATE_SELECTION',
                        selection: data.result.pin,
                        name: data.result.title,
                    })}
                    noResultsMessage={<div>
                        {serachError
                            ? <span className="text-danger">Ошибка: {serachError}</span>
                            : <span>{searchLoad ? "Поиск..." : "Ничего не найдено..."}</span>
                        }
                    </div>}
                    resultRenderer={resultRenderer}
                    results={results}
                    value={value}
                    disabled={requestId ? true : false}
                    className={`search-user-fine-input ${errors.pin ? 'error' : ''}`}
                />

                <Form>

                    <div className="mt-2">
                        <Form.Input
                            fluid
                            type="number"
                            step="0.01"
                            placeholder="Укажите размер штрафа"
                            icon="ruble"
                            value={fine > 0 ? fine : ""}
                            onChange={(e, { value }) => dispatch({
                                type: "SET_SUM_FINE",
                                fine: value,
                            })}
                            error={errors.fine ? true : false}
                        />
                    </div>

                    <div className="mt-2">
                        <Form.TextArea
                            placeholder="Укажите комментарий"
                            value={comment}
                            onChange={(e, { value }) => dispatch({
                                type: "SET_COMMENT_FINE",
                                comment: value,
                            })}
                            error={errors.comment ? true : false}
                        />
                    </div>

                    {chiefs.length > 0 && <div className="mt-3">

                        <div>
                            <strong>Назначить также для руководителя:</strong>
                        </div>

                        {chiefs.map(row => <div className="mt-2" key={row.key}>
                            <Form.Checkbox
                                label={<label><b>{row.value}</b> {row.text}</label>}
                                checked={setsChiefs.indexOf(row.value) >= 0}
                                onClick={(e, { checked }) => dispatch({
                                    type: checked ? "CHIEF_PUSH" : "CHIEF_DROP",
                                    pin: row.value,
                                })}
                            />
                        </div>)}
                    </div>}

                </Form>

            </div>

            <Dimmer
                inverted
                active={loading || save}
                children={<Loader />}
            />

            {!loading && loadingError && <Message error content={loadingError} />}
            {saveError && <Message error content={saveError} />}

        </div>}
        actions={[
            {
                key: "save",
                content: "Сохранить",
                icon: "save",
                labelPosition: "right",
                color: "green",
                disabled: (loading || save),
                onClick: () => setSave(true),
            }
        ]}
    />

}

export default FineAdd;