import { Form } from "semantic-ui-react";

export default function FormSelectColumn(props) {

    const { columns, changeAttr, value, item, name, noLabel, disabled } = props;

    const options = columns.map((row, i) => ({
        key: i,
        onClick: () => changeAttr(name || "column", row.name, item),
        name: name || "column",
        text: row.name,
        value: row.name,
    }));

    return <Form.Select
        label={item === 0 && !noLabel ? "Столбец" : false}
        placeholder="Столбец..."
        options={options}
        width={props.width || 16}
        value={value || ""}
        required
        disabled={disabled}
    />

}