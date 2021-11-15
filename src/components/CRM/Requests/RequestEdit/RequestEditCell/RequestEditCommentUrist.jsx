import { RequestEditCellSaveButton } from "../RequestEditCell";
import { Form, Icon } from "semantic-ui-react";

const RequestEditCommentUrist = props => <Form className="request-edit-cell-body" loading={props.saveLoad}>

    <Form.Field className="mb-2">
        <label><Icon name="comment" />Комментарий юристу</label>
        <Form.TextArea
            placeholder="Укажите комментарий для юриста"
            type="time"
            name="comment_urist"
            rows={4}
            value={props?.formdata?.request?.comment_urist || ""}
            onChange={props.changeData}
            error={props?.errors?.comment_urist ? true : false}
        />
    </Form.Field>

    <RequestEditCellSaveButton {...props} />

</Form>

export default RequestEditCommentUrist;