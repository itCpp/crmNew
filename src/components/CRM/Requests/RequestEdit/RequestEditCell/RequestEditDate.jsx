import { Form, Icon } from "semantic-ui-react";

const RequestEditDate = props => <Form className="request-edit-cell-body" loading={props.saveLoad} size="tiny">

    <Form.Field className="mb-2">
        <label><Icon name="map marker alternate" />Адрес</label>
        <Form.Select
            placeholder="Укажите адрес офиса"
            options={props?.formdata?.addresses || []}
            name="address"
            value={props?.formdata?.request?.address || null}
            onChange={(e, { name, value }) => props.changeData(name, value)}
            error={props?.errors?.address ? true : false}
            disabled={props.load || (props?.permits?.requests_addr_change ? false : true) ? true : false}
        />
    </Form.Field>

    <Form.Field className="mb-2">
        <label><Icon name="calendar check outline" />Дата и время записи</label>
        <Form.Input
            placeholder="Укажите дату"
            type="datetime-local"
            name="event_datetime"
            value={props?.formdata?.request?.event_datetime || ""}
            onChange={(e, { name, value }) => props.changeData(name, value)}
            error={props?.errors?.event_datetime ? true : false}
            disabled={props.load ? true : false}
        />
    </Form.Field>

</Form>

export default RequestEditDate;