import { useEffect, useState } from "react";
import { axios } from "../../../utils";
import { Button, Header, Loader, Message } from "semantic-ui-react";
import GatesList from "./GatesList";
import GateEdit from "./GateEdit";

const Gates = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [row, setRow] = useState(null);

    useEffect(() => {

        axios.post('dev/gates').then(({ data }) => {
            setError(null);
            setRows(data.rows);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="segment-compact">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="GSM шлюзы"
                subheader="Управление GSM шлюзами"
                className="flex-grow-1"
            />

            {loading
                ? <Loader active inline />
                : <Button
                    icon="plus"
                    circular
                    basic
                    color="green"
                    onClick={() => setRow({})}
                />
            }

        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <GatesList
            rows={rows}
            setRows={setRows}
            setEdit={setRow}
        />}

        {row && <GateEdit
            row={row}
            setShow={setRow}
            setRows={setRows}
        />}

    </div>

}

export default Gates;