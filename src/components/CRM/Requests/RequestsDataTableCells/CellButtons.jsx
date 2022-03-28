import React from "react";
import axios from "../../../../utils/axios-header";
import { useDispatch } from "react-redux";
import {
    requestEdit,
    setRequestEditPage,
    setSendSms,
    setShowAudioCall,
    dropRequestRow,
    setShowStoryRequest
} from "../../../../store/requests/actions";
import { Table, Icon, Dropdown } from "semantic-ui-react";

const CellButtons = props => {

    const { row } = props;
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);
    const [hide, setHide] = React.useState(false);

    React.useEffect(() => {

        if (hide) {
            setLoading(true);
            axios.post('requests/hideUplift', { id: hide }).then(({ data }) => {
                dispatch(dropRequestRow(data.request.id));
            }).catch(e => {
                axios.toast(e);
                setLoading(false);
                setHide(false);
            });
        }

    }, [hide]);

    return <Table.Cell style={{ maxWidth: 25 }}>

        <div className="d-flex flex-column justify-content-center align-items-center">

            <Dropdown
                icon="ellipsis vertical"
                pointing="top right"
                direction="left"
                loading={loading}
                lazyLoad
                className="text-center m-1 button-icon-dropdown"
                style={{ minWidth: "15px" }}
            >
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
                        onClick={() => dispatch(setShowStoryRequest(row))}
                    />
                    {row.uplift_hide_access && <Dropdown.Item
                        icon="hide"
                        text="Скрыть из необработанных"
                        onClick={() => setHide(row.id)}
                    />}
                </Dropdown.Menu>
            </Dropdown>

            {/* <Icon
                name="edit"
                onClick={() => dispatch(requestEdit(row))}
                title="Редактировать заявку"
                className="button-icon m-1"
            /> */}

            <span>
                <Icon
                    // name="chevron circle right"
                    name="edit"
                    onClick={() => dispatch(setRequestEditPage(row))}
                    title="Редактировать заявку"
                    className="button-icon m-1"
                    style={{ minWidth: "15px" }}
                />
            </span>

        </div>

    </Table.Cell>

}

export default CellButtons;