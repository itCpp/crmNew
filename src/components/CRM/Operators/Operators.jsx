import React from "react";
import axios from "./../../../utils/axios-header";
import { useSelector } from "react-redux";
import { Loader, Message, Table, Icon } from "semantic-ui-react";
import OperatorRow from "./OperatorRow";

const Operators = props => {

    const online = useSelector(state => state.main.onlineId);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [columns, setColumns] = React.useState([]);
    const [operators, setOperators] = React.useState([]);

    const getOperators = (props = {}) => {

        if (props.first)
            setLoading(true);

        axios.post('ratings/getOperators').then(({ data }) => {
            setError(null);
            setColumns(data.columns);
            setOperators(data.operators);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });
    }

    React.useEffect(() => {
        getOperators({ first: true });
    }, [props.update]);

    return <div className="pb-3 px-2 w-100" id="sms-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Статистика операторов</h4>
            </div>
        </div>

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}
            {loading && <div><Loader active inline="centered" /></div>}

            {!loading && !error && operators.length === 0 && <div className="opacity-50 text-center my-4">
                <strong>Данные статистики операторов отсутствуют</strong>
            </div>}

            {!loading && !error && operators.length > 0 && <Table basic="very" celled compact size="small" selectable>

                <Table.Header>
                    <Table.Row textAlign="center">
                        <Table.HeaderCell className="px-1 py-2">PIN</Table.HeaderCell>
                        {columns.map(column => <Table.HeaderCell
                            key={column.name}
                            className="px-1 py-2"
                            children={column.icon && <Icon name={column.icon} color={column.iconColor || "black"} fitted />}
                            title={column.title}
                        />)}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {operators.map(row => <OperatorRow
                        key={row.pin}
                        row={row}
                        columns={columns}
                        online={online.indexOf(row.userId) >= 0}
                    />)}
                </Table.Body>

            </Table>}

        </div>

    </div>

}

export default Operators;