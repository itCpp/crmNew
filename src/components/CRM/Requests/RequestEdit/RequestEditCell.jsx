import _ from "lodash";
import React from "react";
import axios from "./../../../../utils/axios-header";
import { useSelector, useDispatch } from "react-redux";
import { requestEditCell, updateRequestRow } from "./../../../../store/requests/actions";

import { Placeholder, Icon, Button } from "semantic-ui-react";

import RequestEditClient from "./RequestEditCell/RequestEditClient";
import RequestEditComment from "./RequestEditCell/RequestEditComment";
import RequestEditCommentFirst from "./RequestEditCell/RequestEditCommentFirst";
import RequestEditCommentUrist from "./RequestEditCell/RequestEditCommentUrist";
import RequestEditDate from "./RequestEditCell/RequestEditDate";
import RequestEditTheme from "./RequestEditCell/RequestEditTheme";

const RequestEditCell = props => {

    const dispatch = useDispatch();
    const { editCell } = useSelector(state => state.requests);
    const modal = React.useRef();
    const timeout = React.useRef();

    const [loading, setLoading] = React.useState(true);

    const [save, setSave] = React.useState(false);
    const [saveLoad, setSaveLoad] = React.useState(false);

    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [formdata, setFormdata] = React.useState([]);
    const [permits, setPermits] = React.useState({});

    const closeRequestEditCell = React.useCallback(() => {
        timeout.current = setTimeout(() => {
            dispatch(requestEditCell(null));
            document.body.removeEventListener('click', closeRequestEditCell);
        }, 50);
    }, []);

    React.useEffect(() => {

        if (modal.current && editCell?.id) {

            timeout.current && clearTimeout(timeout.current);
            document.body.addEventListener('click', closeRequestEditCell);

            modal.current.classList.add('show');

            let top = editCell?.pageY || 0,
                left = (editCell?.pageX || 0) - (modal?.current?.clientWidth || 0),
                height = modal?.current?.clientHeight || 0;

            const scrollHeight = document.documentElement.scrollHeight;

            modal.current.style.top = `${top}px`;
            modal.current.style.left = `${left}px`;

            setLoading(true);

            axios.post('requests/getRow', {
                id: editCell?.id
            }).then(({ data }) => {

                setError(null);
                setErrors({});

                setFormdata({
                    request: data.request,
                    addresses: [{ id: null, name: "Не указан" }, ...data.offices].map((office, key) => ({
                        key,
                        text: office.name,
                        value: office.id,
                        disabled: office.active === 0 ? true : false
                    })),
                    cities: [null, ...data.cities].map((row, key) => ({
                        key, value: row, text: row || "Не определен"
                    })),
                    themes: [null, ...data.themes].map((row, key) => ({
                        key, value: row, text: row || "Не определена"
                    })),
                });

                setPermits(data.permits);

                setTimeout(() => {
                    height = modal?.current?.clientHeight || 0;
                    if (scrollHeight < (top + height)) {
                        modal.current.style.top = `${(scrollHeight - height - 10)}px`;
                    }
                }, 100);

            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
                setSaveLoad(false);
            });
        }
        else if (modal.current && !editCell?.id) {
            modal.current.classList.remove('show');
            document.body.removeEventListener('click', closeRequestEditCell);
        }

        return () => document.body.removeEventListener('click', closeRequestEditCell);

    }, [editCell]);

    React.useEffect(() => {

        if (save) {

            setSaveLoad(true);

            axios.post('requests/saveCell', {
                ...(formdata?.request || {}),
                __cell: editCell?.type
            }).then(({ data }) => {
                dispatch(updateRequestRow(data.request));
                dispatch(requestEditCell(null));
            }).catch(e => {
                axios.toast(e, { time: 10000 });
                setErrors(axios.getErrors(e));
                setSaveLoad(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    const changeData = (e, data) => {

        const { name, value } = data;

        setFormdata(prev => ({
            ...prev,
            request: {
                ...prev.request,
                [name]: value,
            }
        }));

    }

    return <div className="request-edit-cell-modal" ref={modal}>

        {loading && <RequestEditCellLoading />}

        {!loading && !error && <RequestEditSwitch
            editCell={editCell}
            loading={loading}
            formdata={formdata}
            setFormdata={setFormdata}
            permits={permits}
            setSave={setSave}
            saveLoad={saveLoad}
            errors={errors}
            changeData={changeData}
        />}

    </div>

}

export const RequestEditCellLoading = () => {
    return <>
        <div className="request-edit-cell-header">
            <Placeholder className="w-100">
                <Placeholder.Header>
                    <Placeholder.Line length='full' />
                </Placeholder.Header>
            </Placeholder>
        </div>
        <div className="request-edit-cell-body">
            <Placeholder className="w-100">
                <Placeholder.Header>
                    <Placeholder.Line />
                    <Placeholder.Line length="full" />
                    <Placeholder.Line length="very short" />
                </Placeholder.Header>
            </Placeholder>
        </div>
    </>
}

export const RequestEditCellModalHeader = props => {

    const dispatch = useDispatch();

    return <div className="request-edit-cell-header">
        <span className="flex-grow-1 header-for-drag">#{props?.formdata?.request?.id || null}</span>
        <span><Icon name="close" onClick={() => dispatch(requestEditCell(null))} /></span>
    </div>
}

export const RequestEditCellSaveButton = props => {

    const { setSave } = props;

    return <Button
        fluid={props.fluid || true}
        size={props.size || "tiny"}
        color={props.color || "green"}
        content={props.children || "Сохранить"}
        onClick={() => setSave(true)}
    />

}

export const caseSensitiveSearch = (options, query) => {
    const re = new RegExp(_.escapeRegExp(query))
    return options.filter((opt) => re.test(opt.text))
}

const RequestEditSwitch = props => {

    let body = null;

    switch (props?.editCell?.type) {
        case "date":
            body = <RequestEditDate {...props} />
            break;
        case "client":
            body = <RequestEditClient {...props} />
            break;
        case "theme":
            body = <RequestEditTheme {...props} />
            break;
        case "commentFirst":
            body = <RequestEditCommentFirst {...props} />
            break;
        case "comment":
            body = <RequestEditComment {...props} />
            break;
        case "commentUrist":
            body = <RequestEditCommentUrist {...props} />
            break;
        default:
            body = <div className="request-edit-cell-body text-center">
                <small>Форма не определена</small>
            </div>;
    }

    return <>
        <RequestEditCellModalHeader {...props} />
        {body}
    </>

}

export default RequestEditCell;