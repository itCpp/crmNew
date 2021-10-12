import { Table, Icon } from "semantic-ui-react";

const CellDate = props => {

    const { row, setCell } = props;

    return <Table.Cell>

        {row.date_uplift &&
            <div title="Дата последнего обращения" className="d-flex justify-content-start">
                <span><Icon name="level up" /></span>
                <span>{row.date_uplift}</span>
            </div>
        }

        <div title="Дата поступления" className="d-flex justify-content-start">
            <span><Icon name="plus" /></span>
            <span>{row.date_create}</span>
        </div>

        {row.date_event &&
            <div title="Дата записи, или прихода" className="d-flex justify-content-start">
                <span><Icon name="clock" /></span>
                <span>{row.date_event}</span>
            </div>
        }

        {row.office?.id &&
            <div title={`Офис ${row.office.name}`} className="d-flex justify-content-start">
                <span><Icon name="map marker alternate" /></span>
                <span>{row.office.name}</span>
            </div>
        }

        <div className="request-cell-edit" data-type="date" onClick={e => setCell(e, row)}>
            <Icon name="pencil" />
        </div>

    </Table.Cell>

}

export default CellDate;