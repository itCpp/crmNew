import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Header, Icon, Input, Pagination } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import BlockModal from "../BlockModal";

const PagesPagination = ({ loading, page, pages, getRows }) => <AdminContentSegment className="text-center">
    <Pagination
        activePage={page || 1}
        totalPages={pages}
        disabled={loading}
        pointing
        secondary
        // ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
        prevItem={{ content: <Icon name='angle left' />, icon: true }}
        nextItem={{ content: <Icon name='angle right' />, icon: true }}
        onPageChange={(e, { activePage }) => getRows({ page: activePage })}
    />
</AdminContentSegment>

const BlockDriveIp = props => {

    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(true);

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

        axios.post('dev/block/drive/ip', { ...params, ...filters }).then(({ data }) => {
            setRows(data.rows);
            setPages(data.pages);
            setTotal(data.total);
        }).catch(e => {

        }).then(() => {
            setLoad(false);
            setLoading(false);
            setSearch(false);
        });

    }, [page, searchWord, filters]);

    useEffect(() => getRows({}), []);

    // useEffect(() => {
    //     if (page > 0) getRows({ page });
    // }, [page]);

    useEffect(() => {
        if (search) getRows({ page: 1, search: searchWord });
    }, [search]);

    return <div style={{ maxWidth: 800 }}>

        {block && <BlockModal
            ip={block}
            open={block !== null}
            close={() => setBlock(null)}
            setRows={setRows}
        />}

        <AdminContentSegment className="d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Управление блокировками IP"
                subheader="Блокировка и разблокировка ip адресов"
                className="flex-grow-1"
            />

        </AdminContentSegment>

        <AdminContentSegment>

            <Input
                action={{
                    color: "blue",
                    icon: "search",
                    content: "Найти",
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

        {pages > 1 && <PagesPagination
            pages={pages}
            page={page}
            loading={loading || load}
            getRows={getRows}
        />}

        {rows && rows.length > 0 && rows.map((row, key) => <BlockDriveIpRow
            key={key}
            row={row}
            loading={loading || load}
            block={setBlock}
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

const BlockDriveIpRow = props => {

    const { row, loading } = props;
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

    return <AdminContentSegment className="mb-2">

        <div className="d-flex align-items-center">

            <Header
                as="a"
                content={row.ip}
                subheader={row.hostname}
                className="flex-grow-1"
                disabled={loading}
            />

            <div>
                <Button
                    size="mini"
                    {...button}
                    disabled={loading}
                    onClick={() => props.block(row.ip)}
                />
            </div>

        </div>

    </AdminContentSegment >

}

export default BlockDriveIp;