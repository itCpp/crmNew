import { useEffect, useState } from "react";
import { Header, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import Table from "../StatisticTable/TableData";
import useSortable from "../StatisticTable/useSortable";

const AllStatistic = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [sites, setSites] = useState([]);

    const {
        sort,
        setSort,
        startSort,
        sortable,
        searchParams,
        DropdownSortable
    } = useSortable({ setRows, ...props });

    useEffect(() => {

        axios.post("dev/block/allstatistics").then(({ data }) => {

            let column = searchParams.get('column');
            let direction = searchParams.get('direction');

            if (column && direction) {
                data.rows.sort((a, b) => sortable(a, b, column, direction));
                setSort({ column, direction });
            }

            setError(null);
            setRows(data.rows);
            setSites(data.sites);

        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div>

        <AdminContentSegment className="d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Общая статистика"
                subheader="Статистика посещений по всем подключенным сайтам"
            />

            {loading && <Loader inline active />}
            {!loading && <div>
                <DropdownSortable />    
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
        />}

    </div>
}

export default AllStatistic;