import { Table, Icon } from "semantic-ui-react";
import { copyPhone } from "./function";

const CellClient = props => {

    const { row, setCell } = props;

    return <Table.Cell>

        {row.client_name &&
            <div title="ФИО клиента" className="d-flex justify-content-start mb-1">
                <span><Icon name="user" className="opacity-80" /></span>
                <span>{row.client_name}</span>
            </div>
        }

        {row.region &&
            <div title="Город" className="d-flex justify-content-start mb-1">
                <span><Icon name="world" className="opacity-80" /></span>
                <span>{row.region}</span>
            </div>
        }

        {row.clients && row.clients.map(client => <div
            key={`client_${row.id}_${client.id}`}
            onClick={(e) => copyPhone(e, client.phone)}
            className="d-flex align-items-center"
        >
            <div>
                <Icon name="copy" className="button-icon" title="Скопировать номер телефона" />
            </div>
            <div className="to-copy-text">{client.phone}</div>
        </div>)}

        <div className="request-cell-edit" data-type="client" onClick={e => setCell(e, row)}>
            <Icon name="pencil" />
        </div>

    </Table.Cell>

}

export default CellClient;