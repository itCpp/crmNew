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

export default (({ requests, height }) => {

    return <Segment
        header={{
            as: "h5",
            content: "Новые заявки"
        }}
        style={{
            height: height || 400,
        }}
    >

        <div className="segmet-list">
            {requests && requests.map((row, i) => <RequestRow key={`${row.id}_new_${i}`} row={row} />)}
        </div>

        {!requests || (requests && requests.length === 0) && <EmptyChart
            height="100%"
            text="Вам ещё не поручали заявок"
        />}

    </Segment>;

})