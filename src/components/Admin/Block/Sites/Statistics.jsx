import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Dropdown, Header, Loader, Message, Icon } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import Table from "../StatisticTable/TableData";
import useSortable from "../StatisticTable/useSortable";

const Statistic = withRouter(props => {

    const { sites, site, setSite } = props;
    const { loading, setLoading } = props;

    const [load, setLoad] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    const {
        sort,
        setSort,
        startSort,
        sortable,
        searchParams,
        DropdownSortable
    } = useSortable({ setRows, ...props });

    useEffect(() => {

        if (site) {

            setLoad(true);

            axios.post("dev/block/allstatistics", { site }).then(({ data }) => {

                let column = searchParams.get('column');
                let direction = searchParams.get('direction');

                if (column && direction) {
                    data.rows.sort((a, b) => sortable(a, b, column, direction));
                    setSort({ column, direction });
                }

                setError(null);
                setRows(data.rows);

            }).catch(e => {
                axios.setError(e, setError);
            }).then(() => {
                setLoad(false);
                setLoading(false);
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

                <DropdownSortable
                    disabled={load}
                />

                <Dropdown
                    selection
                    placeholder="Выберите сайт"
                    options={sites}
                    value={site}
                    onChange={(e, { value }) => setSite(value)}
                    disabled={load || (error ? true : false)}
                    className="ml-2"
                    style={{ zIndex: 101 }}
                />

            </div>}

        </AdminContentSegment>

        {error && !loading && <Message content={error} error />}

        {!error && !loading && <Table
            {...props}
            setRows={setRows}
            rows={rows}
            sites={sites}
            sort={sort}
            startSort={startSort}
            loading={load}
        />}

    </div>
});

export default Statistic;