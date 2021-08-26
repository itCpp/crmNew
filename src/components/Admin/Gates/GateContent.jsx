import React from 'react';
import { connect } from 'react-redux';

import Gates from './body/Gates';
import Checks from './body/Checks';

function GateContent(props) {

    let body = null;

    if (props.content === "gates")
        body = <Gates />
    else if (props.content === "check")
        body = <Checks />
    else
        body = props.content;

    return <div>{body}</div>;

}

const mapStateToProps = state => ({
    content: state.gates.page,
});

export default connect(mapStateToProps)(GateContent);