import React from "react";
import { connect } from "react-redux";

import "./requests.css";

import RequestsData from "./RequestsData";
import RequestEditCell from "./RequestEdit/RequestEditCell";
import BtnScrollTop from "../UI/BtnScrollTop/BtnScrollTop.jsx";

const Requests = props => {

    return <div className="px-3" id="requests-block">

        <RequestsData />

        <RequestEditCell />

        <BtnScrollTop />

    </div>

}

const mapStateToProps = state => ({
    tabs: state.requests.tabs,
});

export default connect(mapStateToProps)(Requests);