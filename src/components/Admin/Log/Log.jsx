import React from "react";
import { Form, Header, Icon, Loader, Message, Select } from "semantic-ui-react";
import { axios, moment } from "../../../utils";
import AdminContentSegment from "../UI/AdminContentSegment";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage('javascript', javascript);

const Log = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [tables, setTables] = React.useState({});
    const [tableList, setTableList] = React.useState([]);
    const [filter, setFilter] = React.useState({});

    React.useEffect(() => {

        axios.get('dev/logs')
            .then(({ data }) => {
                setTables(data.tables);
            })
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoading(false));

    }, []);

    return <div className="segment-compact">

        <AdminContentSegment className="d-flex align-items-center">

            <Header
                as="h2"
                content="Логи"
                subheader="История изменений различных данных"
                className="flex-grow-1"
            />

            {loading && <Loader active inline />}

        </AdminContentSegment>

        {Object.keys(tables).length > 0 && <AdminContentSegment>

            <div className="mb-2">
                <strong>Фильтрация данных</strong>
            </div>

            <Form>

                <Form.Group widths="equal" className="mb-0">

                    <Form.Select
                        placeholder="Выберите базу данных"
                        options={[null, ...Object.keys(tables)].map(row => ({
                            key: row || 0,
                            text: row || "Все базы",
                            value: row,
                        }))}
                        value={filter.db || null}
                        onChange={(e, { value }) => {
                            setFilter(p => ({ ...p, db: value, table: null, id: null }));
                            setTableList([null, ...(tables[value] || [])].map(row => ({
                                key: row || 0,
                                text: row || "Все таблицы",
                                value: row,
                            })))
                        }}
                    />

                    <Form.Select
                        placeholder="Выберите таблицу"
                        options={tableList}
                        disabled={!Boolean(filter.db)}
                        value={filter.table || null}
                        onChange={(e, { value }) => setFilter(p => ({ ...p, table: value, id: null }))}
                    />

                </Form.Group>

            </Form>

        </AdminContentSegment>}

        {error && !loading && <Message error content={error} />}

        {!error && !loading && <DataRows filter={filter} setFilter={setFilter} />}

    </div>
}

const DataRows = props => {

    const { filter, setFilter } = props;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [requestData, setRequestData] = React.useState({});
    const [modelData, setModelData] = React.useState({});
    const [row, setRow] = React.useState({});

    const isRequestData = Object.keys(requestData).length > 0;
    const isModelData = Object.keys(modelData).length > 0;
    const isRow = Object.keys(row).length > 0;

    React.useEffect(() => {

        setLoading(true);

        axios.post('dev/logs/get', filter)
            .then(({ data }) => {

                setRequestData(data.request);
                setModelData(data.model);
                setRow(data.row);

                setError(null);
                hljs.initHighlighting();
            })
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoading(false));

    }, [filter]);

    return <>

        <AdminContentSegment className="d-flex align-items-center justify-content-between">
            <div>
                <Icon
                    name="chevron left"
                    link={!loading}
                    disabled={loading}
                    onClick={() => setFilter(p => ({ ...p, id: row.id, step: "back" }))}
                />
            </div>
            {row?.id && <div style={{ opacity: loading ? 0.5 : 1 }}><strong>LOG_ID:{row.id}</strong></div>}
            <div>
                <Icon
                    name="chevron right"
                    link={!loading}
                    disabled={loading}
                    onClick={() => setFilter(p => ({ ...p, id: row.id, step: "next" }))}
                />
            </div>
        </AdminContentSegment>

        {loading && !isRequestData && !isModelData && <Loader active inline="centered" className="mt-3" />}

        {error && !loading && <Message error content={error} />}

        {!error && !loading && !isRow && !isRequestData && !isModelData && <Message info content="Получается, это все данные, для того, чтобы вывести последнюю строку лога, нажмите на кнопку перехода к следующей записи еще раз" />}

        {Object.keys(row).length > 0 && <AdminContentSegment style={{ opacity: loading ? 0.5 : 1 }}>

            <div>
                <strong className="mr-2">Подключение</strong>
                <span>{row.connection_name}</span>
            </div>

            <div>
                <strong className="mr-2">База данных</strong>
                <span>{row.database_name}</span>
            </div>

            <div>
                <strong className="mr-2">Таблица</strong>
                <span>{row.table_name}</span>
            </div>

            <div>
                <strong className="mr-2">Дата изменения</strong>
                <span>{moment(row.created_at).format("DD.MM.YYYY HH:mm:ss")}</span>
            </div>

            <div>
                <strong className="mr-2">IP</strong>
                <span>{row.ip}</span>
            </div>

            <div>
                <strong className="mr-2">User-Agent</strong>
                <small>{row.user_agent}</small>
            </div>

            {typeof row.user == "object" && <>

                <div>
                    <strong className="mr-2">Пользователь, внёсший изменения</strong>
                    <span>{row.user.pin || "PIN"} - {row.user.name_fio || "ФИО"}</span>
                </div>

            </>}

            <div>
                <strong className="mr-2">Общее количество изменений строки</strong>
                <span>{row.count || 0}</span>
            </div>

        </AdminContentSegment>}

        {isModelData && <>
            <div className="mb-1">
                {row.to_crypt && <Icon name="lock" color={row.to_crypt_access ? "green" : "red"} title="Зашифровано" />}
                <strong>Model data:</strong>
            </div>
            <pre className="mt-1 mb-3" style={{ opacity: loading ? 0.5 : 1 }}>
                <code className="json">{JSON.stringify(modelData, null, "    ")}</code>
            </pre>
        </>}

        {isRequestData && <>
            <div className="mb-1">
                {row.to_crypt && <Icon name="lock" color={row.to_crypt_access ? "green" : "red"} title="Зашифровано" />}
                <strong>Request data:</strong>
            </div>
            <pre className="mt-1 mb-3" style={{ opacity: loading ? 0.5 : 1 }}>
                <code className="json">{JSON.stringify(requestData, null, "    ")}</code>
            </pre>
        </>}

    </>
}

export default Log;