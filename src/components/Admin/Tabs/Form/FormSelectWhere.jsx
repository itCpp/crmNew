import { Form } from "semantic-ui-react";

export default function FormSelectWhere(props) {

    const { query, changeData } = props;

    const where = [
        // { value: "whereFunction", text: "Логическое выражение" },
        { value: "where", text: "where" },
        { value: "orWhere", text: "orWhere" },
        { value: "whereBetween", text: "whereBetween" },
        { value: "whereNotBetween", text: "whereNotBetween" },
        { value: "whereIn", text: "whereIn" },
        { value: "whereNotIn", text: "whereNotIn" },
        { value: "whereNull", text: "whereNull" },
        { value: "orWhereNull", text: "orWhereNull" },
        { value: "whereNotNull", text: "whereNotNull" },
        { value: "orWhereNotNull", text: "orWhereNotNull" },
        { value: "whereDate", text: "whereDate" },
        { value: "whereMonth", text: "whereMonth" },
        // { value: "whereDay", text: "whereDay" },
        { value: "whereYear", text: "whereYear" },
        { value: "whereTime", text: "whereTime" },
        { value: "whereColumn", text: "whereColumn" },
    ];

    const whereOptions = where.map((row, i) => ({
        ...row,
        key: i,
        onClick: changeData,
        name: "where",
    }));

    return <>

        <Form.Select
            placeholder="Выберите выражение..."
            label="Выражение условия"
            required
            options={whereOptions}
            name="where"
            value={query.where || ""}
            width={props.width || 16}
        />

    </>

}