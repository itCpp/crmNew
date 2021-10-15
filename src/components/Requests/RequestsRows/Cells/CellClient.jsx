import { Table, Icon } from "semantic-ui-react";

const CellClient = props => {

    const { row, setCell } = props;

    return <Table.Cell>

        {row.client_name &&
            <div title="ФИО клиента" className="d-flex justify-content-start">
                <span><Icon name="user" /></span>
                <span>{row.client_name}</span>
            </div>
        }

        {row.region &&
            <div title="Город" className="d-flex justify-content-start">
                <span><Icon name="world" /></span>
                <span>{row.region}</span>
            </div>
        }

        {row.clients && row.clients.map(client => <div key={`client_${row.id}_${client.id}`}>
            <div>{client.phone}</div>
        </div>)}

        <div className="request-cell-edit" data-type="client" onClick={e => setCell(e, row)}>
            <Icon name="pencil" />
        </div>

    </Table.Cell>

}

export default CellClient;