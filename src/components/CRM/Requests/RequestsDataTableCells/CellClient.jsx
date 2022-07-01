import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setAddPhoneShow } from "../../../../store/requests/actions";
import { Table, Icon } from "semantic-ui-react";

const PhoneRow = props => {

    const { phone, client, rowId } = props;
    const number = useRef();

    const copyPhone = useCallback((phone) => {
        if (number.current) {

            // navigator clipboard api needs a secure context (https)
            if (navigator.clipboard && window.isSecureContext) {
                // navigator clipboard api method'
                navigator.clipboard.writeText(phone);
            } else {
                // text area method
                let textArea = document.createElement("textarea");
                textArea.value = phone;
                // make the textarea out of viewport
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                new Promise((res, rej) => {
                    // here the magic happens
                    document.execCommand('copy') ? res() : rej();
                    textArea.remove();
                });
            }

            number.current.classList.add('copyed');
            setTimeout(() => number.current.classList.remove('copyed'), 100);
        }
    }, []);

    return <div className="d-flex align-items-center">
        <div>
            <Icon
                name="copy"
                className="button-icon"
                title="Скопировать номер телефона"
                onClick={() => copyPhone(client.hidden ? `+${rowId}s${client.id}` : phone)}
            />
        </div>
        <div className="to-copy-text text-nowrap" ref={number}>
            <a href={`callto://${client.hidden ? `+${rowId}s${client.id}` : phone}`} className="call-to-request">{phone}</a>
        </div>
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
            rowId={row.id}
            phone={client.phone}
            client={client}
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