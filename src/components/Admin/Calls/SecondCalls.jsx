import React from "react";
import { Header, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import AdminContentSegment from "../UI/AdminContentSegment";

const SecondCalls = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {

        axios.post('dev/calls/extensions')
            .then(({ data }) => setRows(data.rows))
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoading(false))

    }, []);

    return <div className="segment-compact">

        <AdminContentSegment
            className="d-flex align-items-center"
            content={<>
                <Header
                    as="h2"
                    content="Внутренние номера"
                    subheader="Настройка внутренних учетных записей телефонии"
                    className="flex-grow-1"
                />

                {loading && <Loader active inline />}
            </>}
        />

        {!loading && error && <Message error content={error} />}

        {!loading && !error && rows.length > 0 && <AdminContentSegment>

            {rows.map(row => <ExtensionRow key={row.id} row={row} />)}

        </AdminContentSegment>}

        {!loading && !error && rows.length === 0 && <AdminContentSegment
            className="text-center py-4"
            content={<strong className="opacity-50">Данных нет</strong>}
        />}

    </div>
}

const ExtensionRow = props => {

    const { row } = props;

    return <div>
        <div>{row.extension}</div>
        <div>{row.internal_addr}</div>
        <div>{row.for_in}</div>
    </div>
}

export default SecondCalls;