import React from "react";
import axios from "./../../../utils/axios-header";
import { Header, Loader } from "semantic-ui-react";

import CallsList from "./CallsList";

const Calls = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [calls, setCalls] = React.useState([]);

    React.useEffect(() => {
        axios.post('dev/getCalls').then(({ data }) => {
            setCalls(data.calls);
        }).catch(error => {
            setError()
        }).then(() => {
            setLoading(false);
        });
    }, []);

    return <>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Звонки"
                subheader="Журнал вызовов и настройка sip-источников"
            />

            {loading
                ? <Loader active inline />
                : <div>
                    {/* <CreateStatus
                        statuses={statuses}
                        setStatuses={setStatuses}
                    /> */}
                </div>
            }

        </div>

        <div className="admin-content-segment d-flex flex-column justify-content-between align-items-center">
            <CallsList calls={calls} />
        </div>

    </>

}

export default Calls;