import React from "react";
import axios from "./../../../utils/axios-header";
import { Header, Loader } from "semantic-ui-react";

import CallsList from "./CallsList";

const Calls = props => {

    const { permits } = props;

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

        window.Echo.private(`App.Admin.Calls`)
            .listen('IncomingCalls', ({ data }) => {
                let newCalls = [data, ...calls].slice(0, -1);
                console.log({ data, newCalls});
                setCalls(newCalls);
            });

        return () => {
            window.Echo.leave(`App.Admin.Calls`);
        }

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

        <div className="d-flex justify-content-start align-items-start flex-segments">
            <div className="admin-content-segment pt-4 position-relative">
                <CallsList calls={calls} />
            </div>
        </div>


    </>

}

export default Calls;