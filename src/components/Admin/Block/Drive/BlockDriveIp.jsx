import { useCallback, useEffect, useState } from "react";
import { Checkbox, Header, Input } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";

const BlockDriveIp = props => {

    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(true);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);

    const [searchWord, setSearchWord] = useState("");
    const [search, setSearch] = useState(false);
    const [filters, setFilters] = useState({});

    const getRows = useCallback(params => {

        setLoad(true);

        axios.post('dev/block/drive/ip', { ...params, ...filters }).then(({ data }) => {
            setRows(data.rows);
        }).catch(e => {

        }).then(() => {
            setLoad(false);
            setLoading(false);
            setSearch(false);
        });

    }, [page, searchWord, filters]);

    useEffect(() => getRows({}), []);

    useEffect(() => {
        if (page > 0) getRows({ page });
    }, [page]);

    useEffect(() => {
        if (search) getRows({ page: 1, search: searchWord });
    }, [search]);

    return <div style={{ maxWidth: 800 }}>

        <AdminContentSegment className="d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Управление блокировками IP"
                subheader="Блокировка и разблокировка ip адресов"
            />

        </AdminContentSegment>

        <AdminContentSegment>

            <Input
                action={{
                    color: 'blue',
                    labelPosition: 'right',
                    icon: 'search',
                    content: 'Найти',
                    onClick: () => (!loading && !load) ? setSearch(true) : null,
                    loading: load,
                }}
                placeholder="Введите IP-адрес или имя хоста..."
                fluid
                value={searchWord}
                disabled={loading || load}
                onChange={(e, { value }) => setSearchWord(value)}
                onKeyUp={e => e.keyCode === 13 ? setSearch(true) : null}
            />

            <div className="mt-3 d-flex align-items-center">

                <div className="flex-grow-1">
                    <Checkbox
                        label="Только IPv4"
                        className="mr-4"
                        disabled={loading || load}
                        checked={filters.ipv4 || false}
                        onChange={(e, { checked }) => setFilters(prev => ({ ...prev, ipv4: checked }))}
                    />
                    <Checkbox
                        label="Только IPv6"
                        className="mr-4"
                        disabled={loading || load}
                        checked={filters.ipv6 || false}
                        onChange={(e, { checked }) => setFilters(prev => ({ ...prev, ipv6: checked }))}
                    />
                </div>

                {total > 0 && <div>Найдено: <b>{total}</b></div>}

            </div>

        </AdminContentSegment>

        {rows && rows.length > 0 && rows.map((row, key) => <BlockDriveIpRow
            key={key}
            row={row}
        />)}

    </div>
}

const BlockDriveIpRow = props => {

    const { row } = props;

    return <AdminContentSegment className="mb-2">

        <Header
            as="a"
            content={row.ip}
        />

    </AdminContentSegment>

}

export default BlockDriveIp;