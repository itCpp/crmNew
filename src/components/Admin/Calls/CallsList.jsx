import React from "react";
import moment from "moment";
import { Icon } from "semantic-ui-react";

const CallsList = props => {

    const { calls } = props;
    return calls.map(call => <div key={call.id} className="d-flex calls-log">
        <div>{call.phone}</div>
        <div>{call.sip}</div>
        <div>{moment(call.created_at).format("DD.MM.YYYY HH:mm:ss")}</div>
        {call.added && <div><Icon name="check" color="green" title="Добавлено в заявку" />{moment(call.added).format("DD.MM.YYYY HH:mm:ss")}</div>}
        {call.failed && <div><Icon name="ban" color="red" title="Проигнорировано" />{moment(call.failed).format("DD.MM.YYYY HH:mm:ss")}</div>}
    </div>);
}

export default CallsList;