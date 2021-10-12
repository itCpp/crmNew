import { Table, Icon } from "semantic-ui-react";

const CellComments = props => {

    const { row, setCell } = props;

    return <Table.Cell>

        <div className="cell-block text-left position-relative" title="Суть обращения">

            <Icon name="comment outline" />
            <span>{row.comment || <span style={{ opacity: 0.4 }}>Суть обращения не указана</span>}</span>

            <div className="request-cell-edit-in-block" data-type="comment" onClick={e => setCell(e, row)}>
                <Icon name="pencil" />
            </div>

        </div>

        <div className="cell-block text-left position-relative" title="Комментарий юристу">

            <Icon name="comment" />
            <span>{row.comment_urist || <span style={{ opacity: 0.4 }}>Комментарий юристу не указан</span>}</span>

            <div className="request-cell-edit-in-block" data-type="commentUrist" onClick={e => setCell(e, row)}>
                <Icon name="pencil" />
            </div>

        </div>

    </Table.Cell>

}

export default CellComments;