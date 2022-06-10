import React from "react";
import { Table, Label, Icon } from "semantic-ui-react";

const OperatorRow = React.memo(props => {

    const { row, columns, online, history } = props;

    return <Table.Row textAlign="center" positive={online}>

        <Table.Cell className="px-1">
            <span className="mr-1">{row.pin}</span>
            {row.sector && <Label
                size="tiny"
                color="blue"
                style={{ padding: "3px 4px" }}
                content={row.sector}
            />}
            {window.permits?.user_data_any_show && <Icon
                name="external"
                className="ml-3 mr-0"
                link
                title="Страница сотрудника"
                onClick={() => history.push(`/user/${row.userId}`)}
            />}
        </Table.Cell>

        {columns.map(column => <Table.Cell
            key={`${column.name}_${row.pin}`}
            className="px-1"
        >

            <pre
                className="m-0"
                style={{
                    opacity: (row[column.name] || 0) === 0 ? 0.3 : 1,
                }}
                title={column.title}
                children={row[column.name] || 0}
            />

        </Table.Cell>)}

    </Table.Row>;

});

export default OperatorRow;