import { Segment } from "../../UI";
import { Table } from "semantic-ui-react";

const RequestRow = props => {

    const { row } = props;

    return <div className="segment-list-row">
        <div>#{row.id}</div>
    </div>

}

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
            {requests.map((row, i) => <RequestRow key={`${row.id}_new_${i}`} row={row} />)}
        </div>

    </Segment>;

})