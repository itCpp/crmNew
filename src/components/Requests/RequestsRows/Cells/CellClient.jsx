import { useCallback, useRef } from "react";
import { Table, Icon } from "semantic-ui-react";

const CellClient = props => {

    const { row, setCell } = props;

    const copyPhone = useCallback((e, phone) => {

        navigator.clipboard.writeText(phone);
        const phoneText = e.currentTarget && e.currentTarget.querySelector('.to-copy-text');

        if (phoneText) {
            phoneText.classList.add('copyed');
            setTimeout(() => phoneText.classList.remove('copyed'), 300);
        }

        // e.target.classList.add('copyed');

        // setTimeout(() => {
        //     e.target.classList.remove('copyed');
        // }, 300);

    }, []);

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