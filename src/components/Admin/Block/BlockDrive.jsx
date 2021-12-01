import React from "react";
import axios from "./../../../utils/axios-header";
import { Header, Loader, Message, Input } from "semantic-ui-react";

export default (props => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    const getRows = formdata => {

        formdata?.search && setLoad(true);

        axios.post('dev/block/getBlockData', formdata).then(({ data }) => {
            setRows(data.rows);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });
    }

    React.useEffect(() => {
        getRows({});
    }, []);

    return <div className="segment-compact">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Управление блокировками"
                subheader={`Блокировка и разблокировка ip адреса и/или имени хоста`}
            />

        </div>

        <div className="admin-content-segment">
            <Input
                icon={{
                    name: 'search',
                    link: !loading && !load
                }}
                placeholder="Введите IP-адрес или имя хоста..."
                className="w-100"
                disabled={loading}
                loading={load}
            />
        </div>

        {!loading && error && <Message error content={error} />}
        {!loading && !error && rows.length === 0 && <Message content="Ничего не найдено" />}

        {!loading && !error && rows.length > 0 && <div>
        </div>}

    </div>
});