import React from "react";
import { useDispatch } from "react-redux";
import { setSearchRequest } from "../../../store/requests/actions";
import "./requests.css";
import RequestsData from "./RequestsData";
import RequestEditCell from "./RequestEdit/RequestEditCell";
import BtnScrollTop from "../UI/BtnScrollTop/BtnScrollTop.jsx";
import AdQueryInfo from "../AdQueryInfo";

const Requests = () => {

    const dispatch = useDispatch();
    const searchParams = (new URL(document.location)).searchParams;
    const search = {};
    const [checked, setChecked] = React.useState(true);

    React.useEffect(() => {

        for (var pair of searchParams.entries()) {
            search[pair[0]] = pair[1];
        }

        if (Object.keys(search).length > 0)
            dispatch(setSearchRequest(search));

        setChecked(false);

    }, []);

    return !checked && <div className="px-3" id="requests-block">

        <AdQueryInfo />

        <RequestsData />

        <RequestEditCell />

        <BtnScrollTop />

    </div>

}

export default Requests;