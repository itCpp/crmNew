import { useCallback, useEffect, useState } from "react";
import { axios, Highlighted } from "../../../../utils";
import { Button, Header, Loader, Message, Input } from "semantic-ui-react";
import AdminContentSegment from "../../UI/AdminContentSegment";
import { PagesPagination } from ".";
import BlockHostModal from "./BlockHostModal";
import BlockDriveInfo from "./BlockDriveInfo";

const BlockDriveHost = () => {

    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(true);
    const [error, setError] = useState(null);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [block, setBlock] = useState(null);

    const [searchWord, setSearchWord] = useState("");
    const [search, setSearch] = useState(false);
    const [filters, setFilters] = useState({});

    const getRows = useCallback(params => {

        setLoad(true);
        setPage(params?.page || 1);

        axios.post('dev/block/drive/host', { ...params, ...filters }).then(({ data }) => {
            setRows(data.rows);
            setPages(data.pages);
            setTotal(data.total);
            setError(null);
        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoad(false);
            setLoading(false);
            setSearch(false);
        });

    }, [page, searchWord, filters]);

    useEffect(() => getRows({}), []);

    useEffect(() => {
        if (search) getRows({ page: 1, search: searchWord });
    }, [search]);

    return <div style={{ maxWidth: 800 }}>

        {block && <BlockHostModal
            host={block}
            setHost={setBlock}
            open={block !== null}
            close={() => setBlock(null)}
            setRows={setRows}
        />}

        <AdminContentSegment className="d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Управление блокировками имени хоста"
                subheader="Блокировка и разблокировка клиентов по имени хоста или его части"
                className="flex-grow-1"
            />

            {loading && <Loader active inline />}

            {!loading && <Button
                color="green"
                icon="plus"
                circular
                basic
                title="Создать блокировку по хосту"
                onClick={() => setBlock(true)}
            />}

        </AdminContentSegment>

        <BlockDriveInfo />

        <AdminContentSegment>

            <Input
                action={{
                    color: "blue",
                    icon: "search",
                    content: "Найти",
                    onClick: () => (!loading && !load) ? setSearch(true) : null,
                    loading: !loading && load,
                }}
                placeholder="Введите IP-адрес или имя хоста..."
                fluid
                value={searchWord}
                disabled={loading || load}
                onChange={(e, { value }) => setSearchWord(value)}
                onKeyUp={e => e.keyCode === 13 ? setSearch(true) : null}
            />

        </AdminContentSegment>

        {!loading && !load && error && <Message content={error} error />}

        {pages > 1 && <PagesPagination
            pages={pages}
            page={page}
            loading={loading || load}
            getRows={getRows}
        />}

        {rows && rows.length > 0 && rows.map((row, key) => <BlockDriveHostRow
            key={key}
            row={row}
            loading={loading || load}
            block={setBlock}
            search={searchWord}
        />)}

        {rows && !(loading || load) && rows.length === 0 && <AdminContentSegment className="text-center py-5">
            <strong className="opacity-50">Ничего не найдено</strong>
        </AdminContentSegment>}

        {pages > 1 && <PagesPagination
            pages={pages}
            page={page}
            loading={loading || load}
            getRows={getRows}
        />}

    </div>
}

const BlockDriveHostRow = props => {

    const { row, loading, search } = props;
    const button = {
        icon: "ban",
        color: "green",
        title: "Заблокировать",
    };

    if (row.blocks_all) {
        button.icon = "minus";
        button.color = "red";
        button.title = "Редактировать блокировки по сайтам";
    } else if (row.is_blocked) {
        button.icon = "minus";
        button.color = "orange";
        button.title = "Редактировать блокировки по сайтам";
    }

    let host = row.host;

    if (search !== "" && search) {
        host = <Highlighted text={row.host} highlight={search} />
    }

    return <AdminContentSegment className="mb-2">

        <div className="d-flex align-items-center">

            <Header
                as="a"
                content={host}
                className="flex-grow-1 m-0"
                disabled={loading}
            />

            <div>
                <Button
                    size="mini"
                    {...button}
                    disabled={loading}
                    onClick={() => props.block(row.host)}
                    className="m-0"
                />
            </div>

        </div>

    </AdminContentSegment >

}

export default BlockDriveHost;