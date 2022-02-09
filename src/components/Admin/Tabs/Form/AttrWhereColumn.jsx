import { Form } from "semantic-ui-react";

import FormSelectColumn from "./FormSelectColumn";
import FormSelectOperators from "./FormSelectOperators";

export default function AttrWhereColumn(props) {

    const { columns, query, changeData } = props;
    const { loading, error, errors } = props;

    const changeAttrArray = (...a) => {

        const e = a[1] || a[0].currentTarget;

        let value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        let attr = [...query.attr];
        attr[e.item] = { ...attr[e.item], [e.name]: value };

        changeData(null, { name: "attr", value: attr });

    }

    const changeAttr = (name, value, item) => {
        changeAttrArray(null, { name, value, item });
    }

    return <div className="where-row">

        {query.attr.map((attr, i) => i === 0 ? <Form.Group key={i}>
            <FormSelectColumn
                columns={columns}
                width={10}
                changeAttr={changeAttr}
                value={attr.column || ""}
                item={i}
                disabled={loading || error}
            />
            <FormSelectOperators
                width={6}
                changeAttr={changeAttr}
                value={attr.operator || ""}
                item={i}
                disabled={loading || error}
            />
            <FormSelectColumn
                columns={columns}
                width={10}
                name="value"
                changeAttr={changeAttr}
                value={attr.value || ""}
                item={i}
                disabled={loading || error}
            />
        </Form.Group> : null)}

    </div>

}