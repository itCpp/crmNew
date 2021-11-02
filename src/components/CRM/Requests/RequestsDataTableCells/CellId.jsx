import { memo } from "react";
import { TableCell, Icon } from "semantic-ui-react";
import QueryTypeIcon from "./Elements/QueryTypeIcon";

const CellId = memo(props => {

    const { row } = props;

    return <TableCell>

        <div>
            {row.query_type &&
                <span className="opacity-50"><QueryTypeIcon query_type={row.query_type} /></span>
            }
            <span title="Номер заявки">#{row.id}</span>
        </div>

        <div title="Источник">
            <span className="opacity-50"><Icon name="fork" /></span>
            <span>{row.source?.name || "Неизвестно"}</span>
        </div>

        <div>{row.status?.name || "Не обработана"}</div>

    </TableCell>

});

export default CellId;