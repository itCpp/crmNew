import React from "react";
import moment from "moment";

const CallsList = props => {

    const { calls } = props;
    return calls.map(call => <div key={call.id}>
        <div>{call.phone}</div>
        <div>{call.sip}</div>
        <div>{call.created_at}</div>
        <div>A {call.added}</div>
        <div>F {call.failed}</div>
    </div>);
}

export default CallsList;