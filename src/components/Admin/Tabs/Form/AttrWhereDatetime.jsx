import { Form } from "semantic-ui-react";

import FormSelectColumn from "./FormSelectColumn";
import FormSelectOperators from "./FormSelectOperators";
import FormInputDate from "./FormInputDate";

export default function AttrWhereDatetime(props) {

    const { columns, query, changeData } = props;

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
            />
            <FormSelectOperators
                width={6}
                changeAttr={changeAttr}
                value={attr.operator || ""}
                item={i}
            />
            <FormInputDate
                {...props}
                attr={attr}
                item={i}
                width={10}
                onChange={changeAttrArray}
            />
        </Form.Group> : null)}

    </div>

}