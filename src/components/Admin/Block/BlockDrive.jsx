import React from "react";
import axios from "./../../../utils/axios-header";
import { Header, Loader, Message, Input, Checkbox, Icon } from "semantic-ui-react";

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

    return <div style={{ maxWidth: 600 }}>

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
            {rows.map(row => <div key={row.id} className="d-flex justify-content-between align-items-center admin-content-segment">

                <h4 className="m-0">
                    {row.block === 1 && <Icon name="ban" color="red" title="Заблокировано" />}
                    {row.is_hostname === 0
                        ? <a style={{ cursor: "pointer" }} onClick={() => props.history.push(`/admin/block/ip?addr=${row.host}`)}>{row.host}</a>
                        : row.host
                    }

                </h4>

                <Checkbox
                    toggle
                    checked={row.block === 1}
                    onChange={console.log}
                />

            </div>)}
        </div>}

    </div>
});