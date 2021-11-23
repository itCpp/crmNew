import React from "react";
import axios from "./../../../utils/axios-header";

import { Message, Loader } from "semantic-ui-react";

import "./queues.css";

const Queues = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [queues, setQueues] = React.useState([]);

    React.useEffect(() => {

        setLoading(true);

        axios.post('queues/getQueues').then(({ data }) => {
            setQueues(data.queues);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="p-3 w-100" id="queues-root">

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}
            {loading && <div><Loader active inline="centered" /></div>}

            {queues.length}

        </div>

    </div>;
}

export default Queues;