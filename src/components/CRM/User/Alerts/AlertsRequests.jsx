import React from "react";
import { axios } from "../../../../utils";
import { Segment } from "../../UI";
import { Icon } from "semantic-ui-react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import QueryTypeIcon from "./../../Requests/RequestsDataTableCells/Elements/QueryTypeIcon";
import { EmptyChart } from "./../User";

const RequestRow = withRouter(props => {

    const { row } = props;

    return <div className={`segment-list-row request-row-theme-${row.status && row.status.theme || 0} px-3 py-2 rounded my-1`} onClick={() => props.history.push(`/requests?id=${row.id}`)}>
        <div className="d-flex justify-content-between align-items-center">
            <span>
                <QueryTypeIcon query_type={row.query_type} />
                <strong>#{row.id}</strong>
                {row.source && <span className="ml-2" title={row.source.name}>{row.source.name}</span>}
            </span>
            <small className="opacity-80" title="Дата назначения">
                <Icon name="plus" />
                {moment(row.set_at).format("DD.MM.YYYY HH:mm")}
            </small>
        </div>
        <div className="d-flex align-items-center flex-wrap">
            {row.client_name && <span className="mr-3 d-flex">
                <Icon name="user" className="opacity-50" />
                {row.client_name}
            </span>}
            {row.comment && <span title="Комментарий" className="d-flex">
                <Icon name="quote right" className="opacity-50" />
                {row.comment}
            </span>}
        </div>
    </div>

});

export default (({ requests, height, updateNotification }) => {

    const [rows, setRows] = React.useState(requests || []);

    const getRequest = React.useCallback((id, cb) => {
        axios.post('requests/get', {
            search: {
                id: id
            }
        }).then(({ data }) => {
            if (typeof cb == "function") {
                cb(data);
            }
        });
    }, []);

    React.useEffect(() => {

        let forType = (updateNotification?.notif_type == "set_request" || updateNotification?.notif_type == "coming")

        if (updateNotification && forType) {

            let push = updateNotification.data?.request_id,
                drop = updateNotification.data?.drop_request_id,
                coming = updateNotification.data?.coming_request;

            if (push) {
                getRequest(push, data => {

                    if (typeof data.requests != "object") return;

                    setRows(prev => {
                        let rows = [...prev];
                        data.requests.forEach(row => {
                            rows.unshift(row);
                        });
                        return rows;
                    });
                });
            }

            if (drop) {
                setRows(prev => {
                    let rows = [...prev];
                    [...prev].forEach((row, i) => {
                        if (row.id === drop) {
                            rows.splice(i, 1);
                        }
                    });
                    return rows;
                });
            }

            if (coming) {
                getRequest(coming, data => {

                    if (typeof data.requests != "object") return;

                    setRows(prev => {
                        let rows = [...prev];
                        rows.forEach((row, i) => {
                            data.requests.forEach(coming_row => {
                                if (row.id === coming_row.id) {
                                    rows[i] = coming_row;
                                }
                            });
                        });
                        return rows;
                    });
                });
            }
        }
    }, [updateNotification]);

    return <Segment
        header={{
            as: "h5",
            content: "Новые заявки"
        }}
        style={{
            height: height || 400,
            position: "relative",
        }}
        className="d-flex flex-column"
    >

        <div className="segmet-list h-100">

            {rows && rows.map((row, i) => <RequestRow key={`${row.id}_new_${i}`} row={row} />)}

            {!rows || (rows && rows.length === 0) && <EmptyChart
                height="100%"
                text="Вам ещё не поручали заявок"
            />}

        </div>

    </Segment>;

})