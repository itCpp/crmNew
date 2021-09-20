import React from "react";
import { withRouter } from "react-router";
import axios from "./../../utils/axios-header";

import { connect } from 'react-redux';
import { setTabList, selectTab, setRequests } from "./../../store/requests/actions";

import { Loader, Message, Table, Icon, Button } from "semantic-ui-react";

import RequestEdit from "./RequestEdit";

const RequestsTableRow = props => {

    const { row, setEdit } = props;

    let type = null;
    if (row.query_type === "call")
        type = <Icon name="call square" title="Звонок" />
    else if (row.query_type === "text")
        type = <Icon name="comment alternate" title="Тектовая заявка" />
    
    return <Table.Row>

        <Table.Cell>
            <div>
                <span style={{ opacity: 0.5 }}>{type}</span>
                <span title="Номер заявки">#{row.id}</span>
            </div>
        </Table.Cell>

        <Table.Cell>
            {row.date_uplift ? <div title="Дата последнего обращения" className="d-flex justify-content-center">
                <Icon name="level up" />
                <span>{row.date_uplift}</span>
            </div> : null}
            <div title="Дата поступления" className="d-flex justify-content-center">
                <Icon name="plus" />
                <span>{row.date_create}</span>
            </div>
            {row.date_event ? <div title="Дата записи, или прихода" className="d-flex justify-content-center">
                <Icon name="clock" />
                <span>{row.date_event}</span>
            </div> : null}
        </Table.Cell>

        <Table.Cell>
            {row.pin ? <div>{row.pin}</div> : null}
        </Table.Cell>

        <Table.Cell>
            {row.client_name ? <div>{row.client_name}</div> : null}
            {row.clients.map(client => <div key={`client_${row.id}_${client.id}`}>
                <div>{client.phone}</div>
            </div>)}
        </Table.Cell>

        <Table.Cell>
            {row.source?.name ? <div>{row.source.name}</div> : null}
        </Table.Cell>

        <Table.Cell>
            <div className="hover-block text-left">
                <Icon name="hashtag" />
                <span>{row.theme || <span style={{ opacity: 0.4 }}>Тема не указана</span>}</span>
            </div>
            <div className="hover-block text-left" title="Комментарий секретаря">
                <Icon name="comment" />
                <span>{row.theme || <span style={{ opacity: 0.4 }}>Комментария нет</span>}</span>
            </div>
        </Table.Cell>

        <Table.Cell>
            {row.region ? <div>{row.region}</div> : null}
        </Table.Cell>

        <Table.Cell>
            <div>{row.status?.name || "Не обработана"}</div>
        </Table.Cell>

        <Table.Cell>
            <Button.Group size="mini" basic className="request-button-control">
                {row.permits?.requests_edit
                    ? <Button
                        icon="edit outline"
                        title="Редактировать заявку"
                        onClick={() => setEdit(row)}
                    />
                    : null
                }
            </Button.Group>
        </Table.Cell>

    </Table.Row>

}

const RequestsTable = props => {

    const { user, permits, select } = props;
    const { requests, setRequests } = props;

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);

    const [error, setError] = React.useState(null);
    const [edit, setEdit] = React.useState(null);

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

            if (data.page > 1)
                setRequests([...requests, data.requests]);
            else
                setRequests(data.requests);

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }

    React.useEffect(() => {

        if (select) {
            setLoading(true);
            getRequests();
        }

    }, [select]);

    if (!select) {
        return <div className="my-4 mx-auto w-100" style={{ maxWidth: "550px" }}>
            <Message info content="Выберите вкладку для отображения заявок" className="mx-1" />
        </div >
    }

    if (loading)
        return <div className="text-center my-4"><Loader active inline indeterminate /></div>

    if (error) {
        return <div className="my-4 mx-auto w-100" style={{ maxWidth: "550px" }}>
            <Message error content={error} className="mx-1" />
        </div >
    }

    return <div className="py-2 px-1">

        {edit
            ? <RequestEdit {...props} row={edit} setOpen={setEdit} />
            : null
        }

        <Table basic textAlign="center" compact>

            <Table.Header>
                <Table.Row id="requests-header-row">
                    <Table.HeaderCell>id</Table.HeaderCell>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Оператор</Table.HeaderCell>
                    <Table.HeaderCell>Имя и телефон</Table.HeaderCell>
                    <Table.HeaderCell>Источник</Table.HeaderCell>
                    <Table.HeaderCell>Тема</Table.HeaderCell>
                    <Table.HeaderCell>Регион</Table.HeaderCell>
                    <Table.HeaderCell>Статус</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {requests.length
                    ? requests.map(row => <RequestsTableRow key={row.id} {...props} row={row} setEdit={setEdit} />)
                    : <Table.Row>
                        <Table.Cell colSpan={document.querySelectorAll('#requests-header-row > *').length}>
                            <div className="text-center my-5 text-muted" style={{ opacity: 0.5 }}>
                                <strong>Данных нет</strong>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                }
            </Table.Body>

        </Table>

    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
    select: state.requests.select,
    requests: state.requests.requests,
});

const mapActionsToProps = {
    setTabList, selectTab, setRequests
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(RequestsTable));