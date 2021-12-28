import React from "react";
import axios from "./../../../utils/axios-header";
import AdminContent from "./../UI/AdminContentSegment";
import { Table } from "semantic-ui-react";

const Routes = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [headers, setHeaders] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);

        axios.post('dev/getRoutes').then(({ data }) => {
            setError(null);
            setHeaders(data.headers);
            setRows(data.routes);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });
    }, [props.location.key]);

    return <>

        <AdminContent
            header={{
                as: "h2",
                content: "Маршрутизация API",
                subheader: "Список всех доступных маршрутов API-сервера",
            }}
        />

        <AdminContent loading={loading}>

            {error && <div className="my-3 text-center text-danger"><b>{error}</b></div>}

            {!error && rows.length === 0 && <div className="my-3 text-center opacity-50">Данных нет</div>}

            <Table basic="very" celled compact size="small" selectable>

                <Table.Header>
                    <Table.Row textAlign="center">
                        {headers.map(header => <Table.HeaderCell
                            key={header}
                            className="px-1 py-2"
                            children={header}
                            title={header}
                        />)}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {!error && rows.length > 0 && rows.map((row, i) => <RouteRow
                        key={i}
                        rowKey={i}
                        row={row}
                        headers={headers}
                    />)}
                </Table.Body>

            </Table>

        </AdminContent>

    </>

}

const RouteRow = props => {

    const { row, rowKey, headers } = props;

    return <Table.Row textAlign="left" verticalAlign="top">
        {headers.map(header => {

            let key = header.toLowerCase();

            return <Table.Cell
                key={`${header}_${rowKey}`}
                className="px-1"
                children={row[key]}
                title={header}
                style={{ whiteSpace: "pre-line" }}
            />
        })}
    </Table.Row>
}

export default Routes;