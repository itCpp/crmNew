import { Table, Icon } from "semantic-ui-react";

const CellDate = props => {

    const { row, setCellEdit } = props;

    return <Table.Cell style={{ minWidth: "125px" }}>

        <div className="position-relative">

            {row.date_uplift &&
                <div title="Дата последнего обращения" className="d-flex justify-content-start">
                    <span className="opacity-80"><Icon name="level up" /></span>
                    <span>{row.date_uplift}</span>
                </div>
            }

            <div title="Дата поступления" className="d-flex justify-content-start">
                <span className="opacity-80"><Icon name="plus" /></span>
                <span>{row.date_create}</span>
            </div>

            {row.date_event &&
                <div title="Дата записи, или прихода" className="d-flex justify-content-start my-1">
                    <span className="opacity-80"><Icon name="clock" /></span>
                    <span>{row.date_event}</span>
                </div>
            }

            {row.office?.id &&
                <div title={`Офис ${row.office.name}`} className="d-flex justify-content-start mt-1">
                    <span className="opacity-80"><Icon name="map marker alternate" /></span>
                    <span>{row.office.name}</span>
                </div>
            }

            <div className="request-cell-edit" data-type="date" onClick={e => setCellEdit(e, row)}>
                <Icon name="pencil" />
            </div>

        </div>

    </Table.Cell>

};

export default CellDate;