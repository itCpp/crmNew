import { RequestEditCellSaveButton } from "../RequestEditCell";
import { Form, Icon } from "semantic-ui-react";

const RequestEditComment = props => <Form className="request-edit-cell-body" loading={props.saveLoad}>

    <Form.Field className="mb-2">
        <label><Icon name="comment outline" />Суть обращения</label>
        <Form.TextArea
            placeholder="Укажите суть обращения"
            type="time"
            name="comment"
            rows={4}
            value={props?.formdata?.request?.comment || ""}
            onChange={props.changeData}
            error={props?.errors?.comment ? true : false}
        />
    </Form.Field>

    <RequestEditCellSaveButton {...props} />

</Form>

export default RequestEditComment;