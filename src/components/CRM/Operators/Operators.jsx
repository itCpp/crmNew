import React from "react";
import axios from "./../../../utils/axios-header";
import { useSelector } from "react-redux";
import { Loader, Message } from "semantic-ui-react";

const Operators = props => {

    const online = useSelector(state => state.main.onlineId);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {

        axios.post('rating/operators').then(({ data }) => {
            
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="pb-3 px-2 w-100" id="sms-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Статистика операторов</h4>
            </div>
        </div>

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}
            {loading && <div><Loader active inline="centered" /></div>}

            {!loading && !error && users.length === 0 && <div className="opacity-50 text-center my-4">
                <strong>Данные статистики операторов отсутствуют</strong>
            </div>}

        </div>

    </div>

}

export default Operators;