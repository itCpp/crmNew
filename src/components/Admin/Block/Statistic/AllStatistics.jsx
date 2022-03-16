import { useEffect, useState } from "react";
import { Header, Loader, Message, Icon } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import Table from "../StatisticTable/TableData";
import useSortable from "../StatisticTable/useSortable";

const AllStatistic = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [sites, setSites] = useState([]);
    const [domains, setDomains] = useState([]);

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
            setDomains(data.domains);

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

        {!error && !loading && <AdminContentSegment>

            <div>Таблица показывает ифнормацию о посещениях за текущий день. По умолчанию сортировка осуществляется по факту блокировки. <strong className="text-danger">Красным</strong> цветом выделены строки, заблокированные на постоянной основе. <strong className="text-warning">Оранжевым</strong> - автоматически заблокированы до конца дня, также об этом информирует соответсвующая иконка <Icon name="window close" color="yellow" fitted /> рядом с IP. Иконка <Icon name="check" color="green" fitted /> рядом с IP означает принадлежность адреса к белому списку. <Icon name="ban" color="orange" fitted /> - Откроет окно для раздельной блокировки по каждому сайту. <Icon name="minus square" color="orange" fitted /> - IP адрес заблокирован на одном из сайтов. <Icon name="minus square" color="red" fitted /> - IP адрес заблокирован на всех сайтах. <Icon name="chart bar" color="green" fitted /> - Страница со статистикой отдельного IP адреса. <Icon name="eye" color="black" fitted /> - Страница поведения IP адреса на сайте.</div>

            {domains && domains.length > 0 && <div className="mt-2">
                <b className="mr-2">Адреса входа:</b>
                {domains.map(domain => <span className={`mx-2`} key={domain}>
                    <a href={`//${domain}`} target="_blank">{domain}</a>
                </span>)}
            </div>}

        </AdminContentSegment>}

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