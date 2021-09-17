import React from "react";
import axios from "./../../utils/axios-header";
import { connect } from 'react-redux';

import { Loader, Message } from "semantic-ui-react";

import "./requests.css";

function Requests(props) {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {

        setLoading(true);

        axios.post('requests/start').then(({ data }) => {
            setError(false);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    if (loading)
        return <div className="text-center my-4"><Loader active inline /></div>

    if (error) {
        return <div className="my-4 mx-auto w-100" style={{ maxWidth: "550px" }}>
            <Message error content={error} className="mx-1" />
        </div >
    }

    return "Requests";

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
});

export default connect(mapStateToProps)(Requests);