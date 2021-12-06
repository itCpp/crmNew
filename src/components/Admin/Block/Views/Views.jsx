import React from "react";
import axios from "./../../../../utils/axios-header";
import { Header, Loader, Message, Table, Pagination, Icon } from "semantic-ui-react";
import moment from "moment";

const Views = props => {

    const [loading, setLoading] = React.useState(true);
    const [loadingError, setLoadingError] = React.useState(null);
    const [top, setTop] = React.useState(0);

    const [loadingPage, setLoadginPage] = React.useState(false);
    const [start, setStart] = React.useState(null);
    const [page, setPage] = React.useState(null);
    const [update, setUpdate] = React.useState(false);
    const [pages, setPages] = React.useState(null);

    const [rows, setRows] = React.useState([]);

    const getRows = (params = {}) => {

        if (loadingPage) return;

        setLoadginPage(true);

        axios.post('dev/block/getViews', { ...params, start }).then(({ data }) => {
            setLoadingError(null);
            setStart(data.start);
            setRows(data.rows);
            setPages(data.pages);

            window.scrollTo(0, 0);

        }).catch(e => {
            setLoadingError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoadginPage(false);
        });

    }

    React.useEffect(() => {

        setLoading(true);

        const header = document.getElementById('header-menu');
        setTop(header?.offsetHeight || 0);

        page !== null && setUpdate(prev => !prev);
        setPage(1);
        setStart(null);
        setRows([]);

    }, [props.location.key]);

    React.useEffect(() => {
        page && getRows({ page: page });
    }, [page, update]);

    return <div>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Статистика просмотров"
                subheader={`Вывод всех просмотров страниц на всех подключенных сайтах`}
            />

        </div>

        {loading && <Loader active inline="centered" />}
        {!loading && loadingError && <Message error content={loadingError} />}

        {!loading && !loadingError && rows && rows.length > 0 && <Table celled compact className="blocks-table mb-3">

            <Table.Header style={{ top, zIndex: 100 }} className="position-sticky">
                <Table.Row>
                    <Table.HeaderCell>Сайт</Table.HeaderCell>
                    <Table.HeaderCell>IP</Table.HeaderCell>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Страница</Table.HeaderCell>
                    <Table.HeaderCell>User-Agent</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows.map(row => <ViewsRow
                    key={`${page}_${row.id}`}
                    row={row}
                    loadingPage={loadingPage}
                />)}
            </Table.Body>

            {pages > 1 && <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan={5}>
                        <Pagination
                            defaultActivePage={page}
                            totalPages={pages}
                            firstItem={{ content: <Icon name="angle double left" />, icon: true }}
                            lastItem={{ content: <Icon name="angle double right" />, icon: true }}
                            prevItem={{ content: <Icon name="angle left" />, icon: true }}
                            nextItem={{ content: <Icon name="angle right" />, icon: true }}
                            pageItem={{
                                onClick: (e, { value }) => setPage(value),
                            }}
                            disabled={loadingPage}
                            onPageChange={(e, { activePage }) => setPage(activePage)}
                        />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>}

        </Table>}

    </div>

}

const ViewsRow = props => {

    const { row } = props;

    let platform = null;

    if (row.platform && row.user_agent) {
        if (row.platform.toLowerCase().indexOf('windows') >= 0)
            platform = <Icon name="windows" color="blue" />
        else if (row.platform.toLowerCase().indexOf('android') >= 0)
            platform = <Icon name="android" color="green" />
        else if (row.platform.toLowerCase().indexOf('linux') >= 0)
            platform = <Icon name="linux" color="orange" />
        else if (row.platform.toLowerCase().indexOf('ios') >= 0 || row.platform.toLowerCase().indexOf('os x') >= 0)
            platform = <Icon name="apple" color="grey" />
    }

    return <Table.Row>
        <Table.Cell>{row.site}</Table.Cell>
        <Table.Cell>
            <pre>{row.ip}</pre>
        </Table.Cell>
        <Table.Cell>
            <div style={{ whiteSpace: "nowrap" }}>
                {moment(row.created_at).format("DD.MM.YYYY HH:mm:ss")}
            </div>
        </Table.Cell>
        <Table.Cell>
            {row.referer && <div style={{ maxWidth: 400, wordWrap: "break-word" }} title={`Переход с ${row.referer}`}>
                <a href={row.referer} target="_blank">{row.referer}</a>
            </div>}
            <div style={{ maxWidth: 400, wordWrap: "break-word" }}>
                {row.referer && <Icon name="share" title={`Переход с ${row.referer}`} />}
                <a href={row.link} target="_blank">{row.link}</a>
            </div>
        </Table.Cell>
        <Table.Cell>
            {row.robot && <Icon name="android" color="red" title="Это робот зашел" />}
            {row.desktop && <Icon name="desktop" title={row.platform} />}
            {row.phone && <Icon name="mobile alternate" title={row.platform} />}
            {row.tablet && <Icon name="tablet alternate" title={row.platform} />}
            {platform}
            {row.user_agent}</Table.Cell>
    </Table.Row>
}

export default Views;