import { useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
import TableBodyRow from "./TableBodyRow";
import BlockModal from "../BlockModal";

const TableData = props => {

    const [top, setTop] = useState(0);
    const [rows, setRows] = useState([]);
    const [block, setBlock] = useState(null);

    useEffect(() => {
        const header = document.getElementById('header-menu');
        setTop(header?.offsetHeight || 0);
    }, []);

    useEffect(() => setRows(props.rows), [props.rows]);

    return <>

        {block && <BlockModal
            ip={block}
            open={block !== null}
            close={() => setBlock(null)}
        />}

        <Table
            sortable
            compact
            celled
            className="blocks-table"
            selectable
            style={{ fontSize: "80%" }}
        >

            <Table.Header style={{ top: top, zIndex: 100 }} className="position-sticky">
                <Table.Row>
                    <Table.HeaderCell>IP адрес</Table.HeaderCell>
                    <Table.HeaderCell>Хост</Table.HeaderCell>
                    <Table.HeaderCell>Посещений</Table.HeaderCell>
                    <Table.HeaderCell>Все посещения</Table.HeaderCell>
                    <Table.HeaderCell>Заявок</Table.HeaderCell>
                    <Table.HeaderCell>Заявок всего</Table.HeaderCell>
                    <Table.HeaderCell>Очередь</Table.HeaderCell>
                    <Table.HeaderCell>Вся очередь</Table.HeaderCell>
                    <Table.HeaderCell>Блок. входы</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows.map(row => <TableBodyRow
                    {...props}
                    key={row.ip}
                    row={row}
                    block={setBlock}
                />)}
            </Table.Body>

        </Table>

    </>

}

export default TableData;