import { useDispatch } from "react-redux";
import { requestEdit, setRequestEditPage, setSendSms, setShowAudioCall } from "../../../../store/requests/actions";
import { Table, Icon, Dropdown } from "semantic-ui-react";

const CellButtons = props => {

    const { row } = props;
    const dispatch = useDispatch();

    return <Table.Cell style={{ maxWidth: 25 }}>

        <div className="d-flex flex-column justify-content-center align-items-center">

            <Dropdown icon={{ name: "ellipsis vertical", fitted: true }} className="m-1 button-icon-dropdown" pointing="top right" direction="left">
                <Dropdown.Menu style={{ marginTop: 4, marginRight: -6 }}>
                    <Dropdown.Item
                        icon="edit"
                        text="Редактировать"
                        onClick={() => dispatch(requestEdit(row))}
                    />
                    <Dropdown.Item
                        icon="file audio"
                        text="Аудиозаписи"
                        onClick={() => dispatch(setShowAudioCall({ request: row.id }))}
                    />
                    <Dropdown.Item
                        icon="mail"
                        text="СМС сообщения"
                        onClick={() => dispatch(setSendSms(row.id))}
                    />
                    <Dropdown.Item
                        icon="history"
                        text="История изменений"
                        disabled
                    />
                </Dropdown.Menu>
            </Dropdown>

            {/* <Icon
                name="edit"
                onClick={() => dispatch(requestEdit(row))}
                title="Редактировать заявку"
                className="button-icon m-1"
            /> */}

            <Icon
                // name="chevron circle right"
                name="edit"
                onClick={() => dispatch(setRequestEditPage(row))}
                title="Редактировать заявку"
                className="button-icon m-1"
            />

        </div>

    </Table.Cell>

}

export default CellButtons;