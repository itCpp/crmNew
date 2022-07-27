import React from "react";
import { withRouter } from "react-router-dom";
import axios from "./../../../../utils/axios-header";
import { Button, Header, Loader, Message, Table, Pagination, Icon, Dropdown, Label } from "semantic-ui-react";
import ViewsRow from "./ViewsRow";
import ViewData from "./ViewData";

const Views = props => {

    const searchParams = new URLSearchParams(props.location.search);
    const filterIp = searchParams.get('ip');

    const [loading, setLoading] = React.useState(true);
    const [loadingError, setLoadingError] = React.useState(null);
    const [top, setTop] = React.useState(0);

    const [loadingPage, setLoadginPage] = React.useState(false);
    const [start, setStart] = React.useState(null);
    const [page, setPage] = React.useState(null);
    const [site, setSite] = React.useState(Number(searchParams.get('site')));
    const [update, setUpdate] = React.useState(false);
    const [pages, setPages] = React.useState(null);
    const [date, setDate] = React.useState(null);
    const [total, setTotal] = React.useState(0);

    const [sites, setSites] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [jsonData, setJsonData] = React.useState(null);

    const getRows = (params = {}) => {

        if (loadingPage) return;

        setLoadginPage(true);

        axios.post('dev/block/getViews', {
            start,
            ip: filterIp,
            site,
            date,
            allToDay: Number(searchParams.get('allToDay')) > 0,
            onlyOurIp: Number(searchParams.get('onlyOurIp')) > 0,
            ...params,
        }).then(({ data }) => {

            setLoadingError(null);
            setStart(data.start);
            setRows(data.rows);
            setPages(data.pages);
            setTotal(data.total);

            sites && sites.length === 0 && setSites(data.sites || []);
            site === 0 && setSite(data.site);

            data.date && setDate(data.date);

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
        setRows({});

    }, [props.location.key]);

    React.useEffect(() => {
        page && getRows({ page: page });
    }, [page, update]);

    return <div>

        {Boolean(jsonData) && <ViewData
            open={Boolean(jsonData)}
            data={jsonData}
            close={() => {
                setJsonData(null);
            }}
        />}

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Статистика просмотров"
                subheader="Вывод всех просмотров страниц на всех подключенных сайтах"
                className="flex-grow-1"
            />

            {!loading && <div className="mr-2">
                <Icon
                    name="lightning"
                    size="large"
                    color={Number(searchParams.get('onlyOurIp')) > 0 ? "yellow" : null}
                    link
                    onClick={() => {
                        searchParams.set('onlyOurIp', Number(searchParams.get('onlyOurIp')) > 0 ? 0 : 1);
                        props.history.replace('?' + searchParams.toString());
                    }}
                    title="Вывести посещения с наших IP"
                />
            </div>}

            {total > 0 && !loading && <div>
                <Label className="d-flex align-items-center">
                    <Icon
                        name={Number(searchParams.get('allToDay')) > 0 ? "calendar" : "calendar alternate"}
                        color={Number(searchParams.get('allToDay')) > 0 ? "green" : "blue"}
                        title={Number(searchParams.get('allToDay')) > 0 ? "Посещения только за сегодня" : "Посещения за все время"}
                        size="large"
                        link
                        onClick={() => {
                            searchParams.set('allToDay', Number(searchParams.get('allToDay')) > 0 ? 0 : 1);
                            props.history.replace('?' + searchParams.toString());
                        }}
                    />
                    {total}
                </Label>
            </div>}

            <Dropdown
                selection
                placeholder="Выберите сайт"
                options={sites}
                value={site}
                onChange={(e, { value }) => {
                    setPage(null);
                    setSite(value);

                    searchParams.set('site', value);
                    props.history.replace('?' + searchParams.toString());
                    // getRows({ site: value });
                }}
                disabled={loadingPage}
                className="ml-2"
                style={{ zIndex: 101 }}
            />

        </div>

        {loading && <Loader active inline="centered" />}
        {!loading && loadingError && <Message error content={loadingError} />}

        {!loading && !loadingError && rows && rows.length === 0 && <div className="admin-content-segment py-3 text-center">
            <strong>Ничего не найдено</strong>
        </div>}

        {!loading && !loadingError && rows && rows.length > 0 && <Table celled compact selectable className="blocks-table mb-3">

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
                    history={props.history}
                    filterIp={filterIp}
                    setJsonData={setJsonData}
                />)}
            </Table.Body>

            {pages > 1 && <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan={5}>

                        <div className="d-flex align-items-center">
                            <Pagination
                                defaultActivePage={page ?? 1}
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

                            <Button
                                content={Number(searchParams.get('allToDay')) > 0 ? "За все время" : "Все сегодня"}
                                color="blue"
                                className="ml-2"
                                onClick={() => {
                                    searchParams.set('allToDay', Number(searchParams.get('allToDay')) > 0 ? 0 : 1);
                                    props.history.replace('?' + searchParams.toString());
                                }}
                                disabled={loadingPage}
                            />
                        </div>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>}

        </Table>}

    </div>

}

export default withRouter(Views);