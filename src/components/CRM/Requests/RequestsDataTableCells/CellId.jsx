import { useDispatch } from "react-redux";
import { TableCell, Icon } from "semantic-ui-react";
import { setShowAdInfo } from "../../../../store/requests/actions";
import QueryTypeIcon from "./Elements/QueryTypeIcon";

const CellId = props => {

    const { row } = props;
    const dispatch = useDispatch();

    return <TableCell>

        <div className="d-flex">
            {row.query_type && <span className="opacity-80">
                <QueryTypeIcon query_type={row.query_type} />
            </span>}
            <span title="Номер заявки">#{row.id}</span>
            {row?.permits?.requests_show_resource && <span>
                <Icon
                    name="info"
                    className="ml-1"
                    link
                    onClick={() => dispatch(setShowAdInfo(row))}
                />
            </span>}
        </div>

        <div className="wrap-cell" title={row.status?.name || "Не обработана"}>
            <strong>{row.status?.name || "Не обработана"}</strong>
        </div>

        <div title={`Источник: ${row.source?.name || "Неизвестно"}`} className="d-flex mt-1">
            <span className="opacity-80"><Icon name="fork" /></span>
            <span className="wrap-cell wrap-cell-max">{row.source?.name || "Неизвестно"}</span>
        </div>

        {row?.permits?.requests_show_resource && row.resource?.val && <div className="text-nowrap">
            {row.resource.type === "phone" && <span title="Звонок с телефона">
                <Icon name="phone" className="opacity-80" />
                {row.resource.val}
            </span>}
            {row.resource.type === "site" && <span title="Заявка с сайта">
                <Icon name="world" className="opacity-80" />
                <a href={`//${row.resource.val}`} target="_blank" style={{ color: "inherit" }} className="wrap-cell wrap-cell-max for-hover-link">{row.resource.val}</a>
            </span>}
        </div>}

    </TableCell>

};

export default CellId;