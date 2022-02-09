import React from "react";

import { Form } from "semantic-ui-react";

import FormSelectColumn from "./FormSelectColumn";

export default function AttrWhereNull(props) {

    const { columns, query, changeData } = props;
    const { loading, error, errors } = props;

    const changeAttrArray = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        let attr = [...query.attr];
        attr[e.item] = { ...attr[e.item], [e.name]: value };

        changeData(null, { name: "attr", value: attr });
    }

    const changeAttr = (name, value, item = 0) => {
        changeAttrArray(null, { name, value, item });
    }

    return <div className="where-row">

        {query.attr.map((attr, i) => i === 0
            ? <div key={i}>

                <Form.Group>
                    <FormSelectColumn
                        columns={columns}
                        changeAttr={changeAttr}
                        value={attr.column || ""}
                        item={0}
                        disabled={loading || error}
                    />
                </Form.Group>

            </div>
            : null
        )}

    </div>

}