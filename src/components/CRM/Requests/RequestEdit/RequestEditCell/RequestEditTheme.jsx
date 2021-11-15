import { RequestEditCellSaveButton, caseSensitiveSearch } from "../RequestEditCell";
import { Form, Icon, Dropdown } from "semantic-ui-react";

const RequestEditTheme = props => <Form className="request-edit-cell-body" loading={props.saveLoad}>

    <Form.Field className="mb-2">
        <label><Icon name="book" />Тематика</label>
        <Dropdown
            placeholder="Укажите тематику"
            search={caseSensitiveSearch}
            selection
            options={props?.formdata?.themes || []}
            name="theme"
            value={props?.formdata?.request?.theme || ""}
            onChange={props.changeData}
            error={props?.errors?.theme ? true : false}
        />
    </Form.Field>

    <RequestEditCellSaveButton {...props} />

</Form>

export default RequestEditTheme;