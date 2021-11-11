import { useState } from "react";
import { Table, Icon } from "semantic-ui-react";

const CellComments = props => {

    const { row, setCellEdit } = props;
    const [showComment, setShowComment] = useState(false);

    return <Table.Cell>

        <div className="cell-block text-left position-relative mb-2" title="Суть обращения">

            <span className={showComment ? "truncate-text-show" : "truncate-text"} onClick={() => setShowComment(prev => !prev)}>
                <Icon name="comment outline" className="opacity-80" />
                {row.comment || <span className="opacity-30">Суть обращения не указана</span>}
            </span>

            <div className="request-cell-edit-in-block" data-type="comment" onClick={e => setCellEdit(e, row)}>
                <Icon name="pencil" />
            </div>

        </div>

        <div className="cell-block text-left position-relative" title="Комментарий юристу">

            <Icon name="comment" className="opacity-80" />
            <span>{row.comment_urist || <span className="opacity-30">Комментарий юристу не указан</span>}</span>

            <div className="request-cell-edit-in-block" data-type="commentUrist" onClick={e => setCellEdit(e, row)}>
                <Icon name="pencil" />
            </div>

        </div>

    </Table.Cell>

}

export default CellComments;