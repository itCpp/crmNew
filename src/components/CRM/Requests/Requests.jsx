import React from "react";
import { connect } from "react-redux";

import RequestsData from "./RequestsData";

const Requests = props => {

    return <div className="px-3" id="requests-block">

        <RequestsData />

    </div>

}

const mapStateToProps = state => ({
    tabs: state.requests.tabs,
});

export default connect(mapStateToProps)(Requests);