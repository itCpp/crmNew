import { useEffect, useState } from "react";
import { axios } from "../../../utils";
import { Button, Header, Loader, Message, Icon } from "semantic-ui-react";
import DataBasesList from "./DataBasesList";
import DataBaseEdit from "./DataBaseEdit";

const DataBases = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [row, setRow] = useState(null);

    useEffect(() => {

        axios.post('dev/databases').then(({ data }) => {
            setError(null);
            setRows(data.rows);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="segment-compact">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Базы данных"
                subheader="Базы данных сайтов для поиска заявок"
                className="flex-grow-1"
            />

            {loading
                ? <Loader active inline />
                : <Button
                    icon="plus"
                    circular
                    basic
                    color="green"
                    onClick={() => setRow({})}
                />
            }

        </div>

        <div className="admin-content-segment">
            <div>В данном разделе производится настройка баз данных сайтов, к которым будет происходить периодическое подключение и дальнейшее помещение полученных заявок в очередь обработки. <Icon name="database" color="green" fitted /> произведена успешная проверка подключения к базе данных, <Icon name="database" color="red" fitted /> - база данных недоступна, <Icon name="database" color="grey" disabled fitted /> - база данных отключена в настройках</div>

            <div className="mt-2">Индивиудальная статистика по сайту: <Icon name="area chart" color="blue" fitted /> - включена, <Icon name="area chart" color="yellow" fitted /> - включена, но не используется, <Icon name="area chart" color="grey" disabled fitted /> - отключена</div>
        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <DataBasesList
            rows={rows}
            setRows={setRows}
            setEdit={setRow}
        />}

        {row && <DataBaseEdit
            row={row}
            setShow={setRow}
            setRows={setRows}
        />}

    </div>

}

export default DataBases;