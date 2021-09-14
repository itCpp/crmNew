import { Form } from "semantic-ui-react";

export default function TabFormName(props) {

    const { formdata, changeFormdata, error, errors } = props;

    return <>

        <Form.Input
            placeholder="Укажите наименование вкладки..."
            label="Наименование вкладки"
            name="name"
            value={formdata.name || ""}
            onChange={changeFormdata}
            disabled={error ? true : false}
            error={errors.name || false}
            required
        />

        <Form.Input
            placeholder="Укажите заголовок вкладки..."
            label="Заголовок при наведении на вкладку"
            name="name_title"
            value={formdata.name_title || ""}
            onChange={changeFormdata}
            disabled={error ? true : false}
            error={errors.name_title || false}
        />

    </>

}