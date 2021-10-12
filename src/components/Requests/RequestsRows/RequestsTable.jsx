import React from "react";
import axios from "./../../../utils/axios-header";
import Hooks from "./../../../hooks";
import { Table, Icon, Button, Loader } from "semantic-ui-react";
import RequestsTableRow from "./RequestsTableRow";
import RequestEditCell from "./../RequestEditCell";


const RequestsTable = props => {

    const { requests, getRequests } = props;
    const { paginate, loadPage } = props;

    const elem = React.useRef();
    Hooks.useObserver(elem, paginate.page >= paginate.pages, loadPage, () => {
        let page = (paginate.page + 1);
        if (page <= paginate.pages)
            getRequests({ ...paginate, page });
    });

    const [editCell, setEditCell] = React.useState(null);

    const setCell = (e, row) => setEditCell({
        id: row.id,
        type: e.currentTarget?.dataset ? e.currentTarget?.dataset.type : null,
        pageX: e.clientX,
        pageY: e.clientY,
        currentTarget: e.currentTarget,
    });

    return <>

        <Table basic="very" textAlign="left" compact className="mb-0">

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
                        setCell={setCell}
                    />)
                    : <Table.Row>
                        <Table.Cell colSpan={7}>
                            <div className="text-center mt-5 mb-4 text-muted" style={{ opacity: 0.5 }}><strong>Данных нет</strong></div>
                        </Table.Cell>
                    </Table.Row>
                }
            </Table.Body>

        </Table>

        {editCell?.id && <RequestEditCell {...props} editCell={editCell} setEditCell={setEditCell} />}

        <div ref={elem} className="loader-requests">
            {loadPage && <img src="/images/loader.gif" />}
        </div>

    </>

}

export default RequestsTable;