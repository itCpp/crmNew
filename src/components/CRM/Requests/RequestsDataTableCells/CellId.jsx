import { TableCell, Icon } from "semantic-ui-react";
import QueryTypeIcon from "./Elements/QueryTypeIcon";

const CellId = props => {

    const { row } = props;

    return <TableCell>

        <div className="d-flex">
            {row.query_type &&
                <span className="opacity-80"><QueryTypeIcon query_type={row.query_type} /></span>
            }
            <span title="Номер заявки">#{row.id}</span>
        </div>

        <div title={`Источник: ${row.source?.name || "Неизвестно"}`} className="d-flex">
            <span className="opacity-80"><Icon name="fork" /></span>
            <span className="wrap-cell wrap-cell-max">{row.source?.name || "Неизвестно"}</span>
        </div>

        <div className="wrap-cell" title={row.status?.name || "Не обработана"}>
            <strong>{row.status?.name || "Не обработана"}</strong>
        </div>

    </TableCell>

};

export default CellId;