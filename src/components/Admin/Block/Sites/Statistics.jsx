import { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Dropdown, Header, Loader, Message, Dimmer, Button } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import Table from "../StatisticTable/TableData";
import useSortable from "../StatisticTable/useSortable";
import ExceptionHostsList from "./ExceptionHostsList";
import { Lines } from "./Lines";
import DropdownFilter from "./DropdownFilter";

const Statistic = withRouter(props => {

    const { sites, site, setSite } = props;
    const { loading, setLoading } = props;

    const [load, setLoad] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [domains, setDomains] = useState([]);

    const [filterUtm, setFilterUtm] = useState([]);
    const [filterRefferer, setFilterRefferer] = useState([]);
    const [filters, setFilters] = useState([]);
    const [filtersRefferer, setFiltersRefferer] = useState([]);

    const [loadChart, setLoadChart] = useState(true);
    const [chart, setChart] = useState([]);

    const {
        sort,
        setSort,
        startSort,
        sortable,
        searchParams,
        DropdownSortable
    } = useSortable({ setRows, ...props });

    const handleFilterUtm = (utm, refferer) => {

        let utms = [...filterUtm],
            refferers = [...filterRefferer];

        Boolean(utm) && setFilterUtm(p => {
            let rows = [...p],
                fund = p.indexOf(utm);

            if (fund >= 0) rows.splice(fund, 1);
            else rows.push(utm);

            utms = [...rows];

            return rows;
        });

        Boolean(refferer) && setFilterRefferer(p => {
            let rows = [...p],
                fund = p.indexOf(refferer);

            if (fund >= 0) rows.splice(fund, 1);
            else rows.push(refferer);

            refferers = [...rows];

            return rows;
        });

        setTimeout(() => getAllStatistics({
            site,
            utm: utms,
            refferer: refferers
        }), 500)

    }

    const getAllStatistics = useCallback((params, cb) => {

        setLoad(true);

        axios.post("dev/block/allstatistics", params || {}).then(({ data }) => {

            let column = searchParams.get('column');
            let direction = searchParams.get('direction');

            if (column && direction) {
                data.rows.sort((a, b) => sortable(a, b, column, direction));
                setSort({ column, direction });
            }

            setError(null);
            setRows(data.rows);
            setDomains(data.domains || []);
            setFilters(data.filterUtm || []);
            setFiltersRefferer(data.filterRefferers || []);

            if (typeof cb == "function")
                cb(data);

        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoad(false);
            setLoading(false);
        });

    }, []);

    useEffect(() => {

        if (site) {

            setFilterUtm([]);

            getAllStatistics({ site }, () => {
                axios.post('dev/block/getChartSiteOwnStat', { site }).then(({ data }) => {
                    setChart(data.chart || []);
                }).catch(e => {
                    axios.toast(e);
                }).then(() => {
                    setLoadChart(false);
                });
            });
        }

    }, [site]);

    return <div>

        <AdminContentSegment className="d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Статистика по сайтам"
                subheader="Выберите сайт в правом меню"
                className="flex-grow-1"
            />

            {(loading || load) && <Loader inline active />}

            {!loading && <div className="ml-2">

                {/* <ExceptionHostsList disabled={load} site={searchParams.get('site')} /> */}

                <DropdownFilter
                    site={site}
                    filters={filters}
                    setFilters={setFilters}
                    filtersRefferer={filtersRefferer}
                    setFiltersRefferer={setFiltersRefferer}
                    disabled={load}
                    filterUtm={filterUtm}
                    filterRefferer={filterRefferer}
                    handleFilterUtm={handleFilterUtm}
                    load={load}
                />

                <DropdownSortable disabled={load} />

                <Dropdown
                    selection
                    placeholder="Выберите сайт"
                    options={sites}
                    value={site}
                    onChange={(e, { value }) => {
                        searchParams.set('site', value);
                        props.history.replace(`?${searchParams.toString()}`);
                        setSite(value);
                    }}
                    disabled={load || (error ? true : false) || (sites || []).length === 0}
                    className="ml-2"
                    style={{ zIndex: 101 }}
                />

            </div>}

        </AdminContentSegment>

        {error && !loading && <Message content={error} error />}

        {!error && !loading && <>

            {domains && domains.length > 0 && <AdminContentSegment>
                <b className="mr-2">Адреса входа:</b>
                {domains.map(domain => <span className={`${load ? 'opacity-50' : 'opacity-100'} mx-2`} key={domain}>
                    <a href={`//${domain}`} target="_blank">{domain}</a>
                </span>)}
            </AdminContentSegment>}

            {site && <AdminContentSegment>
                <Header as="h5" content="График посещений" className="mb-3" />
                <Lines data={chart} />
                {loadChart && <Dimmer active inverted><Loader indeterminate /></Dimmer>}
            </AdminContentSegment>}

            <Table
                {...props}
                setRows={setRows}
                rows={rows}
                sites={sites}
                sort={sort}
                startSort={startSort}
                loading={load}
            />

        </>}

    </div>
});

export default Statistic;