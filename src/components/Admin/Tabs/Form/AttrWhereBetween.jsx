import { Button, Form } from "semantic-ui-react";

import FormSelectColumn from "./FormSelectColumn";

export default function AttrWhereBetween(props) {

    const { columns, query, changeData } = props;

    const changeAttrArray = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
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

        {query.attr.map((attr, i) => <Form.Group key={i}>
            <FormSelectColumn
                columns={columns}
                width={8}
                changeAttr={changeAttr}
                value={attr.column || ""}
                item={i}
            />
            <Form.Input
                label={i === 0 ? "Значение от" : false}
                placeholder="Значение от"
                width={8}
                required
                name="value0"
                value={attr.value0 || ""}
                item={i}
                onChange={changeAttrArray}
            />
            <Form.Input
                label={i === 0 ? "Значение до" : false}
                placeholder="Значение до"
                width={8}
                required
                name="value1"
                value={attr.value1 || ""}
                item={i}
                onChange={changeAttrArray}
            />
        </Form.Group>)}

    </div>

}