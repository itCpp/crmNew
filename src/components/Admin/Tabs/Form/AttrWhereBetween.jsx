import { Form } from "semantic-ui-react";

import FormSelectColumn from "./FormSelectColumn";

export default function AttrWhereBetween(props) {

    const { columns, query, changeData } = props;
    const { loading, error, errors } = props;

    const changeAttrArray = (...a) => {

        const e = a[1] || a[0].currentTarget;

        let value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        let attr = [...query.attr];

        if (!attr[e.item].between)
            attr[e.item].between = [];

        if (e.name === "value0" || e.name == "value1") {

            let between = attr[e.item].between || [];

            if (e.name === "value1")
                between[1] = value;

            if (e.name == "value0")
                between[0] = value;

            if (!between[0])
                between[0] = "";

            e.name = "between";
            value = between;

        }

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
            <Form.Input
                label={i === 0 ? "Значение от" : false}
                placeholder="Значение от"
                width={8}
                required
                name="value0"
                value={typeof attr.between == "object" ? attr.between[0] : ""}
                item={i}
                onChange={changeAttrArray}
                disabled={loading || error}
            />
            <Form.Input
                label={i === 0 ? "Значение до" : false}
                placeholder="Значение до"
                width={8}
                required
                name="value1"
                value={typeof attr.between == "object" ? attr.between[1] : ""}
                item={i}
                onChange={changeAttrArray}
                disabled={loading || error}
            />
        </Form.Group> : null)}

    </div>

}