import React from "react";
import { withRouter } from "react-router";
import axios from "./../../utils/axios-header";

import { connect } from 'react-redux';
import {
    setTabList,
    selectTab,
    selectedUpdateTab,
    setRequests,
    updateRequestRow
} from "./../../store/requests/actions";

import { Loader, Message, Table, Icon, Button, Grid } from "semantic-ui-react";

import RequestEdit from "./RequestEdit";
import RequestEditCell from "./RequestEditCell";
import RequestPinChange from "./RequestPinChange";
import RequestSectorChange from "./RequestSectorChange";
import RequestAdd from "./RequestAdd";

const RequestsTableRow = props => {

    const { row, setEdit } = props;
    const { setEditCell } = props;

    const setCell = e => {

        let data = {
            id: row.id,
            type: e.currentTarget?.dataset ? e.currentTarget?.dataset.type : null,
            pageX: e.clientX,
            pageY: e.clientY,
            currentTarget: e.currentTarget,
        }

        setEditCell(data);

    }

    let className = ["request-row"];

    let type = null;
    if (row.query_type === "call")
        type = <Icon name="call square" title="Звонок" />
    else if (row.query_type === "text")
        type = <Icon name="comment alternate" title="Тектовая заявка" />

    return <Table.Row className={className.join(' ')}>

        <Table.Cell>

            <div>
                <span style={{ opacity: 0.5 }}>{type}</span>
                <span title="Номер заявки">#{row.id}</span>
            </div>

            <div title="Источник">
                <span style={{ opacity: 0.5 }}><Icon name="fork" /></span>
                <span>{row.source?.name || "Неизвестно"}</span>
            </div>

            <div>{row.status?.name || "Не обработана"}</div>

        </Table.Cell>

        <Table.Cell>

            {row.date_uplift ? <div title="Дата последнего обращения" className="d-flex justify-content-start">
                <span><Icon name="level up" /></span>
                <span>{row.date_uplift}</span>
            </div> : null}

            <div title="Дата поступления" className="d-flex justify-content-start">
                <span><Icon name="plus" /></span>
                <span>{row.date_create}</span>
            </div>

            {row.date_event ? <div title="Дата записи, или прихода" className="d-flex justify-content-start">
                <span><Icon name="clock" /></span>
                <span>{row.date_event}</span>
            </div> : null}

            {row.office?.id ? <div title={`Офис ${row.office.name}`} className="d-flex justify-content-start">
                <span><Icon name="map marker alternate" /></span>
                <span>{row.office.name}</span>
            </div> : null}

            <div className="request-cell-edit" data-type="date" onClick={setCell}>
                <Icon name="pencil" />
            </div>

        </Table.Cell>

        <Table.Cell>
            <RequestSectorChange {...props} />
            <RequestPinChange {...props} />
        </Table.Cell>

        <Table.Cell>

            {row.client_name ? <div title="ФИО клиента" className="d-flex justify-content-start">
                <span><Icon name="user" /></span>
                <span>{row.client_name}</span>
            </div> : null}

            {row.region ? <div title="Город" className="d-flex justify-content-start">
                <span><Icon name="world" /></span>
                <span>{row.region}</span>
            </div> : null}

            {row.clients.map(client => <div key={`client_${row.id}_${client.id}`}>
                <div>{client.phone}</div>
            </div>)}

            <div className="request-cell-edit" data-type="client" onClick={setCell}>
                <Icon name="pencil" />
            </div>

        </Table.Cell>

        <Table.Cell>

            <div className="cell-block text-left position-relative">

                <Icon name="hashtag" />
                <span>{row.theme || <span style={{ opacity: 0.4 }}>Тема не указана</span>}</span>

                <div className="request-cell-edit-in-block" data-type="theme" onClick={setCell}>
                    <Icon name="pencil" />
                </div>

            </div>

            <div className="cell-block text-left position-relative" title="Комментарий секретаря">

                <Icon name="comment alternate outline" />
                <span>{row.comment_first || <span style={{ opacity: 0.4 }}>Комментария нет</span>}</span>

                <div className="request-cell-edit-in-block" data-type="commentFirst" onClick={setCell}>
                    <Icon name="pencil" />
                </div>

            </div>

        </Table.Cell>

        <Table.Cell>

            <div className="cell-block text-left position-relative" title="Суть обращения">

                <Icon name="comment outline" />
                <span>{row.comment || <span style={{ opacity: 0.4 }}>Суть обращения не указана</span>}</span>

                <div className="request-cell-edit-in-block" data-type="comment" onClick={setCell}>
                    <Icon name="pencil" />
                </div>

            </div>

            <div className="cell-block text-left position-relative" title="Комментарий юристу">

                <Icon name="comment" />
                <span>{row.comment_urist || <span style={{ opacity: 0.4 }}>Комментарий юристу не указан</span>}</span>

                <div className="request-cell-edit-in-block" data-type="commentUrist" onClick={setCell}>
                    <Icon name="pencil" />
                </div>

            </div>

        </Table.Cell>

        <Table.Cell>
            <Button.Group size="mini" basic className="request-button-control">
                {row.permits?.requests_edit
                    ? <Button
                        icon="edit outline"
                        title="Редактировать заявку"
                        onClick={() => {
                            setEdit(row);
                            setEditCell(null);
                        }}
                    />
                    : null
                }
            </Button.Group>
        </Table.Cell>

    </Table.Row>

}

const RequestsTable = props => {

    const { user, select } = props;
    const { selectedUpdate, selectedUpdateTab } = props;
    const { requests, setRequests } = props;

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);

    const [error, setError] = React.useState(null);
    const [edit, setEdit] = React.useState(null);
    const [editCell, setEditCell] = React.useState(null);
    const [permits, setPermits] = React.useState({});

    const [add, setAdd] = React.useState(false);

    React.useEffect(() => {
        selectedUpdateTab(true);
    }, []);

    React.useEffect(() => {

        if (edit) {
            props.history.replace(`${props.match.path}?edit=${edit.id}`);
        }
        else {
            props.history.replace(props.match.path);
        }

    }, [edit]);

    const getRequests = () => {

        setLoad(true);

        axios.post('requests/get', {
            tabId: select,
        }).then(({ data }) => {

            setError(null);
            setPermits(data.permits);

            if (data.page > 1)
                setRequests([...requests, data.requests]);
            else
                setRequests(data.requests);

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
            setLoad(false);
            selectedUpdateTab(false);
        });

    }

    React.useEffect(() => {

        if (select && selectedUpdate) {
            setLoading(true);
            getRequests();
        }

    }, [select, selectedUpdate]);

    /**
     * Вывод доступных к выбору сектров
     * @returns {object}
     */
    const findSectors = async formdata => {

        let response = {};

        await axios.post('requests/changeSectorShow', formdata).then(({ data }) => {
            response = { ...data, done: true };
        }).catch(error => {
            response = {
                done: false,
                error: axios.getError(error),
            }
        });

        return response;

    }

    /**
     * Смена сектора
     * @returns {boolean}
     */
    const changeSector = async formdata => {

        let response = true;

        await axios.post('requests/setSector', formdata).then(({ data }) => {
            props.updateRequestRow(data.request);
        }).catch(error => {
            axios.toast(error, { time: 5000 });
            response = false;
        });

        return response;

    }

    if (!select) {
        return <div className="my-4 mx-auto w-100" style={{ maxWidth: "550px" }}>
            <Message info content="Выберите вкладку для отображения заявок" className="mx-1" />
        </div >
    }

    if (loading)
        return <div className="text-center my-4 w-100"><Loader active inline indeterminate /></div>

    if (error) {
        return <div className="my-4 mx-auto w-100" style={{ maxWidth: "550px" }}>
            <Message error content={error} className="mx-1" />
        </div >
    }

    return <div className="px-3" id="requests-block">

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Заявки</h4>
            </div>
            {permits.requests_add
                ? <>
                    <Button
                        icon="plus"
                        color="green"
                        circular
                        title="Создать заявку"
                        basic
                        onClick={() => setAdd(true)}
                    />
                    {add
                        ? <RequestAdd {...props} permits={permits} setOpen={setAdd} />
                        : null
                    }
                </>
                : null
            }
        </div>

        {edit
            ? <RequestEdit {...props} row={edit} setOpen={setEdit} />
            : null
        }

        <Grid columns={1}>

            <Grid.Row>

                <Grid.Column>

                    <div className="block-card">

                        <Table basic='very' textAlign="left" compact>

                            <Table.Header>
                                <Table.Row id="requests-header-row">
                                    <Table.HeaderCell>id</Table.HeaderCell>
                                    <Table.HeaderCell>Дата</Table.HeaderCell>
                                    <Table.HeaderCell>Оператор</Table.HeaderCell>
                                    <Table.HeaderCell>Клиент</Table.HeaderCell>
                                    <Table.HeaderCell>Тема</Table.HeaderCell>
                                    <Table.HeaderCell>Комментарии</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {requests.length
                                    ? requests.map(row => <RequestsTableRow
                                        key={row.id}
                                        {...props}
                                        row={row}
                                        setEdit={setEdit}
                                        setEditCell={setEditCell}
                                        findSectors={findSectors}
                                        changeSector={changeSector}
                                    />)
                                    : <Table.Row>
                                        <Table.Cell colSpan={document.querySelectorAll('#requests-header-row > *').length}>
                                            <div className="text-center mt-5 mb-4 text-muted" style={{ opacity: 0.5 }}>
                                                <strong>Данных нет</strong>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                }
                            </Table.Body>

                        </Table>

                    </div>

                </Grid.Column>

            </Grid.Row>

        </Grid >


        {editCell?.id
            ? <RequestEditCell {...props} editCell={editCell} setEditCell={setEditCell} />
            : null
        }

    </div>


}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
    select: state.requests.select,
    selectedUpdate: state.requests.selectedUpdate,
    requests: state.requests.requests,
});

const mapActionsToProps = {
    setTabList, selectTab, setRequests, updateRequestRow, selectedUpdateTab
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(RequestsTable));