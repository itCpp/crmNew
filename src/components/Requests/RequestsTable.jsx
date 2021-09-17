import React from "react";
import axios from "./../../utils/axios-header";

import { connect } from 'react-redux';
import { setTabList, selectTab } from "./../../store/requests/actions";

import { Loader, Message } from "semantic-ui-react";

const RequestsTable = props => {

    const { user, permits, select } = props;

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);

    const [error, setError] = React.useState(null);

    const getRequests = () => {

        setLoad(true);

        axios.post('requests/get', {
            tab: select,
        }).then(({ data }) => {
            setError(null);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }

    React.useEffect(() => {

        if (select) {
            setLoading(true);
            getRequests();
        }

    }, [select]);

    if (!select) {
        return <div className="my-4 mx-auto w-100" style={{ maxWidth: "550px" }}>
            <Message info content="Выберите вкладку для отображения заявок" className="mx-1" />
        </div >
    }

    if (loading)
        return <div className="text-center my-4"><Loader active inline indeterminate /></div>

    if (error) {
        return <div className="my-4 mx-auto w-100" style={{ maxWidth: "550px" }}>
            <Message error content={error} className="mx-1" />
        </div >
    }

    return null;

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
    select: state.requests.select,
});

const mapActionsToProps = {
    setTabList, selectTab
}

export default connect(mapStateToProps, mapActionsToProps)(RequestsTable);