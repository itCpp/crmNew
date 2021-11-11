import { Table, Icon } from "semantic-ui-react";

const CellTheme = props => {

    const { row, setCellEdit } = props;

    return <Table.Cell>
        
        <div className="cell-block text-left position-relative mb-2 text-nowrap">

            <Icon name="hashtag" className="opacity-80" />
            <span>{row.theme || <span className="opacity-30">Тема не указана</span>}</span>

            <div className="request-cell-edit-in-block" data-type="theme" onClick={e => setCellEdit(e, row)}>
                <Icon name="pencil" />
            </div>

        </div>

        <div className="cell-block text-left position-relative" title="Первичный коммментарий">

            <Icon name="comment alternate outline" className="opacity-80" />
            <span>{row.comment_first || <span className="opacity-30">Комментария нет</span>}</span>

            {row.permits.requests_comment_first && <div className="request-cell-edit-in-block" data-type="commentFirst" onClick={e => setCellEdit(e, row)}>
                <Icon name="pencil" />
            </div>}

        </div>

    </Table.Cell>

}

export default CellTheme;