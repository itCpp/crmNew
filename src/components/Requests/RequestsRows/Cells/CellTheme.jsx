import { Table, Icon } from "semantic-ui-react";

const CellOperator = props => {

    const { row, setCell } = props;

    return <Table.Cell>

        <div className="cell-block text-left position-relative">

            <Icon name="hashtag" />
            <span>{row.theme || <span style={{ opacity: 0.4 }}>Тема не указана</span>}</span>

            <div className="request-cell-edit-in-block" data-type="theme" onClick={e => setCell(e, row)}>
                <Icon name="pencil" />
            </div>

        </div>

        <div className="cell-block text-left position-relative" title="Комментарий секретаря">

            <Icon name="comment alternate outline" />
            <span>{row.comment_first || <span style={{ opacity: 0.4 }}>Комментария нет</span>}</span>

            <div className="request-cell-edit-in-block" data-type="commentFirst" onClick={e => setCell(e, row)}>
                <Icon name="pencil" />
            </div>

        </div>

    </Table.Cell>

}

export default CellOperator;