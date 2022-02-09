import { Form } from "semantic-ui-react";

export default function FormInputDate(props) {

    const { query, attr, item, onChange, width, disabled } = props;

    let title = "Дата",
        type = "date";

    switch (query?.where) {
        case ('whereMonth'):
            title = "Месяц";
            type = "month";
            break;
        case ('whereYear'):
            title = "Год";
            type = "year";
            break;
        case ('whereTime'):
            title = "Время";
            type = "time";
            break;
    }

    return <Form.Input
        label={title}
        placeholder="title"
        type={type}
        name="value"
        value={attr.value || ""}
        onChange={onChange}
        item={item}
        width={width || 16}
        required
        style={{ maxHeight: "38px" }}
        disabled={disabled || false}
    />

}