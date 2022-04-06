import React from "react";
import { Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import FineRow from "./FineRow";

const Fines = props => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    const getRows = React.useCallback((params = {}) => {

        setLoad(true);

        axios.post('fines/index', params).then(({ data }) => {
            setError(null);
            setRows(data.rows);
        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }, []);

    React.useEffect(() => {
        getRows();
    }, []);

    return <div className="pb-3 px-2 w-100" style={{ maxWidth: "700px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Штрафы</h4>
            </div>
        </div>

        {!loading && error && <Message
            error
            content={error}
            className="m-0"
        />}

        {!loading && rows && rows.length > 0 && rows.map(row => <FineRow
            key={row.id}
            row={row}
            setRows={setRows}
        />)}

    </div>
}

export default Fines;