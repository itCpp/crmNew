import { useCallback, useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
import TableBodyRow from "./TableBodyRow";
import BlockModal from "../BlockModal";
import ShowIpInfo from "./ShowIpInfo";
import CommentIp from "./CommentIp";

const TableData = props => {

    const { loading } = props;
    const { rows, setRows } = props;
    const { sort, startSort } = props;

    const sortColumn = String(sort?.column).split(",");

    const [top, setTop] = useState(0);
    const [block, setBlock] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [comment, setComment] = useState(null);

    const showIpInfo = useCallback(row => {
        setShowInfo(row);
    }, []);

    useEffect(() => {
        const header = document.getElementById('header-menu');
        setTop(header?.offsetHeight || 0);
    }, []);

    return <>

        {block && <BlockModal
            ip={block}
            open={block !== null}
            close={() => setBlock(null)}
            setRows={setRows}
        />}

        <ShowIpInfo
            open={Boolean(showInfo)}
            close={() => setShowInfo(false)}
            ip={showInfo}
        />

        {Boolean(comment) && <CommentIp
            ip={comment}
            close={() => setComment(null)}
            setRows={setRows}
        />}

        <Table
            sortable
            compact
            celled
            className="blocks-table mb-3"
            selectable
            style={{ fontSize: "80%" }}
        >

            <Table.Header style={{ top: top, zIndex: 100 }} className="position-sticky">
                <Table.Row>
                    <Table.HeaderCell
                        onClick={() => startSort('ip')}
                        sorted={sortColumn.indexOf("ip") >= 0 ? sort.direction : null}
                        content="IP адрес"
                    />
                    <Table.HeaderCell
                        onClick={() => startSort('host')}
                        sorted={sortColumn.indexOf("host") >= 0 ? sort.direction : null}
                        content="Хост или комментарий"
                    />
                    <Table.HeaderCell
                        onClick={() => startSort('visits')}
                        sorted={sortColumn.indexOf("visits") >= 0 ? sort.direction : null}
                        content="Посещений"
                        title="Посещения сегодня до блокировки"
                    />
                    <Table.HeaderCell
                        onClick={() => startSort('visits_all')}
                        sorted={sortColumn.indexOf("visits_all") >= 0 ? sort.direction : null}
                        content="Все посещения"
                        title="Посещения за все время"
                    />
                    <Table.HeaderCell
                        onClick={() => startSort('requests')}
                        sorted={sortColumn.indexOf("requests") >= 0 ? sort.direction : null}
                        content="Заявок"
                        title="Зафиксировано оставления заявок через сайты"
                    />
                    <Table.HeaderCell
                        onClick={() => startSort('requests_all')}
                        sorted={sortColumn.indexOf("requests_all") >= 0 ? sort.direction : null}
                        content="Заявок всего"
                        title="Заявок за все время"
                    />
                    <Table.HeaderCell
                        onClick={() => startSort('queues')}
                        sorted={sortColumn.indexOf("queues") >= 0 ? sort.direction : null}
                        content="Очередь"
                        title="Поступило запросов в очередь сегодня"
                    />
                    <Table.HeaderCell
                        onClick={() => startSort('queues_all')}
                        sorted={sortColumn.indexOf("queues_all") >= 0 ? sort.direction : null}
                        content="Вся очередь"
                        title="Поступило запросов в очередь за все время"
                    />
                    <Table.HeaderCell
                        onClick={() => startSort('visits_drops')}
                        sorted={sortColumn.indexOf("visits_drops") >= 0 ? sort.direction : null}
                        content="Блок. входы"
                        title="Попыток входа на сайт после блокировки"
                    />
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>

                {rows.map(row => <TableBodyRow
                    {...props}
                    key={row.ip}
                    row={row}
                    block={setBlock}
                    comment={setComment}
                    setRows={setRows}
                    loading={loading}
                    showIpInfo={showIpInfo}
                />)}

                {typeof rows == "object" && rows.length === 0 && <Table.Row>
                    <Table.Cell
                        disabled={loading}
                        textAlign="center"
                        colSpan={10}
                        content={<div className="opacity-50 my-5"><b>Данных за сегодня нет</b></div>}
                    />
                </Table.Row>}

            </Table.Body>

        </Table>

    </>

}

export default TableData;