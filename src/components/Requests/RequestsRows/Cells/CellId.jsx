import { Table, Icon } from "semantic-ui-react";

const CellId = props => {

    const { row } = props;

    return <Table.Cell>

        <div>
            <span style={{ opacity: 0.5 }}>{row.query_type_icon}</span>
            <span title="Номер заявки">#{row.id}</span>
        </div>

        <div title="Источник">
            <span style={{ opacity: 0.5 }}><Icon name="fork" /></span>
            <span>{row.source?.name || "Неизвестно"}</span>
        </div>

        <div>{row.status?.name || "Не обработана"}</div>

    </Table.Cell>

}

export default CellId;