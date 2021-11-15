import { RequestEditCellSaveButton } from "../RequestEditCell";
import { Form, Icon } from "semantic-ui-react";

const RequestEditCommentFirst = props => <Form className="request-edit-cell-body" loading={props.saveLoad}>

    <Form.Field className="mb-2">
        <label><Icon name="comment alternate outline" />Первичный комментарий</label>
        <Form.TextArea
            placeholder="Укажите первичный комментарий"
            type="time"
            name="comment_first"
            rows={4}
            value={props?.formdata?.request?.comment_first || ""}
            onChange={props.changeData}
            error={props?.errors?.comment_first ? true : false}
        />
    </Form.Field>

    <RequestEditCellSaveButton {...props} />

</Form>

export default RequestEditCommentFirst;