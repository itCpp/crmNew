import { Table, Icon } from "semantic-ui-react";

const CellOperator = props => {

    const { row, setCell } = props;

    return <Table.Cell>

        {props.children}

    </Table.Cell>

}

export default CellOperator;