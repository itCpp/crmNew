import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setAddPhoneShow } from "../../../../store/requests/actions";
import { Table, Icon } from "semantic-ui-react";

const PhoneRow = props => {

    const { phone } = props;
    const number = useRef();

    const copyPhone = useCallback((phone) => {
        navigator.clipboard.writeText(phone);
        number.current && number.current.classList.add('copyed');
        setTimeout(() => number.current && number.current.classList.remove('copyed'), 100);
    }, []);

    return <div onClick={() => copyPhone(phone)} className="d-flex align-items-center">
        <div>
            <Icon name="copy" className="button-icon" title="Скопировать номер телефона" />
        </div>
        <div className="to-copy-text" ref={number}>{phone}</div>
    </div>

}

const CellClient = props => {

    const { row, setCellEdit } = props;
    const dispatch = useDispatch();

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

        {row.clients && row.clients.map(client => <PhoneRow
            key={`client_${row.id}_${client.id}`}
            phone={client.phone}
        />)}

        <div className="button-icon" title="Добавить номер телефона" onClick={() => dispatch(setAddPhoneShow(row.id))}>
            <Icon.Group>
                <Icon name="phone" />
                <Icon corner="top left" name="plus" style={{ textShadow: "none" }} />
            </Icon.Group>
            <span>Добавить</span>
        </div>

        <div className="request-cell-edit" data-type="client" onClick={e => setCellEdit(e, row)}>
            <Icon name="pencil" />
        </div>

    </Table.Cell>

}

export default CellClient;