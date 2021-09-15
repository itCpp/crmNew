import { Form } from "semantic-ui-react";

export default function FormSelectOperators(props) {

    const { changeAttr, value, item } = props;

    const operators = [
        '=', '>', '<', '>=', '<=', '!=', '<>', 'like', '%like', 'like%', '%like%'
    ];

    const options = operators.map((row, i) => ({
        key: i,
        onClick: () => changeAttr("operator", row, item),
        name: "operator",
        text: row,
        value: row,
    }));

    return <Form.Select
        label={item === 0 ? "Оператор" : false}
        placeholder="Оператор..."
        options={options}
        width={props.width || 16}
        value={value}
        required
    />

}