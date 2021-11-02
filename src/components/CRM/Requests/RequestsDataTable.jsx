import React from "react";
import { connect } from "react-redux";

import { Icon, Table } from "semantic-ui-react";
import RequestsDataTableRow from "./RequestsDataTableRow";

const RequestsDataTable = React.memo(props => {

    console.log("RequestsDataTable", props);
    const { requests } = props;

    return <>

        {requests && requests.length === 0 &&
            <div className="my-2 opacity-40 text-center">
                <div>
                    <Icon
                        name="database"
                        className="my-1 mx-0 opacity-50"
                        style={{
                            fontSize: "2.4rem",
                            lineHeight: "2.4rem",
                        }}
                    />
                </div>
                <div><strong>Заявок нет</strong></div>
            </div>
        }

        {requests && requests.length > 0 &&
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
                    {requests.map((row, i) => <RequestsDataTableRow
                        key={`${row.id}_${i}`}
                        row={row}
                    />)}
                </Table.Body>

            </Table>
        }

    </>

});

const mapStateToProps = state => ({
    requests: state.requests.requests,
});

export default connect(mapStateToProps)(RequestsDataTable);