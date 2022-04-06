import React from "react";
import moment from "../../../utils/moment";
import { Dimmer, Icon, Loader } from "semantic-ui-react";
import { axios } from "../../../utils";

const FineRow = props => {

    const { row, setRows, load } = props;
    const [loading, setLoading] = React.useState(false);

    const setUpdateRow = React.useCallback(data => {

        setRows(prev => {

            let rows = [...prev];

            rows.forEach((row, i) => {
                if (row.id === data.id) {
                    rows[i] = data;
                }
            });

            return rows;
        });

    }, []);

    const fineDelete = React.useCallback((id) => {

        setLoading(true);

        axios.delete('fines/delete', {
            params: {
                id: id,
            }
        }).then(({ data }) => {
            setUpdateRow(data);
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const fineRestore = React.useCallback((id) => {

        setLoading(true);

        axios.post('fines/restore', {
            id
        }).then(({ data }) => {
            setUpdateRow(data);
        }).catch(e => {
            axios.toast(e);
            // setUpdateRow({ ...row, is_restore: false });
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="block-card mb-3 px-3 py-2" style={{
        backgroundColor: row.deleted_at ? "#ff00001c" : "#ffffff",
        overflow: "hidden",
        opacity: load ? 0.6 : 1,
    }}>

        <div className="d-flex align-items-center">

            <div className="d-flex flex-grow-1">
                <h4 className="m-0">{row.user_pin}</h4>
                {row.user_fio && <span className="ml-2">{row.user_fio}</span>}
            </div>

            <small>{moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</small>

            <div className="ml-3">
                <Icon name="rub" disabled={row.deleted_at ? true : false} />
                {row.deleted_at ? <strike>{row.fine}</strike> : <span>{row.fine}</span>}
            </div>

            <div className="d-flex">

                {row.is_delete && <span>
                    <Icon
                        name="trash alternate"
                        className="ml-2 mr-0"
                        link
                        color="red"
                        title="Удалить штраф"
                        onClick={() => fineDelete(row.id)}
                        disabled={loading}
                    />
                </span>}

                {row.is_restore && <span>
                    <Icon
                        name="redo"
                        className="ml-2 mr-0"
                        link
                        color="blue"
                        title="Вернуть удаленный штраф"
                        onClick={() => fineRestore(row.id)}
                        disabled={loading}
                    />
                </span>}

            </div>

        </div>

        {row.comment && <div className="mt-2">
            {row.is_autofine && <span className="text-primary mr-2" title="Автоматический штраф">Автоматический штраф</span>}
            {row.from_pin && <b className="mr-2">{row.from_pin}</b>}
            {row.from_fio && <span className="mr-2">{row.from_fio}:</span>}
            <i>{row.comment}</i>
        </div>}

        <Dimmer active={loading} inverted>
            <Loader />
        </Dimmer>

    </div>

}

export default FineRow;