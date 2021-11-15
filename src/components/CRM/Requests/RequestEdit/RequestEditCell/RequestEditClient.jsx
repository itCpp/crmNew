import { RequestEditCellSaveButton, caseSensitiveSearch } from "../RequestEditCell";
import { Form, Icon, Dropdown } from "semantic-ui-react";

const RequestEditClient = props => <Form className="request-edit-cell-body" loading={props.saveLoad}>

    <Form.Field className="mb-2">
        <label><Icon name="user" />ФИО клиента</label>
        <Form.Input
            placeholder="Укажите ФИО клиента"
            name="client_name"
            value={props?.formdata?.request?.client_name || ""}
            onChange={props.changeData}
            error={props?.errors?.client_name ? true : false}
            disabled={props.load ? true : false}
        />
    </Form.Field>

    <Form.Field className="mb-2">
        <label><Icon name="world" />Город</label>
        <Dropdown
            fluid
            placeholder="Укажите город"
            search={caseSensitiveSearch}
            selection
            options={props?.formdata?.cities || []}
            name="region"
            value={props?.formdata?.request?.region || ""}
            onChange={props.changeData}
            error={props?.errors?.region ? true : false}
            disabled={props.load ? true : false}
        />
    </Form.Field>

    <RequestEditCellSaveButton {...props} />

</Form>

export default RequestEditClient;