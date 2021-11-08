import React from "react";
import { connect } from "react-redux";

import "./requests.css";

import RequestsData from "./RequestsData";
import BtnScrollTop from "../UI/BtnScrollTop/BtnScrollTop.jsx";

const Requests = props => {

    return <div className="px-3" id="requests-block">

        <RequestsData />
        <BtnScrollTop />

    </div>

}

const mapStateToProps = state => ({
    tabs: state.requests.tabs,
});

export default connect(mapStateToProps)(Requests);