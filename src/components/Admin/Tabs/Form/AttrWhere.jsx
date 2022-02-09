import React from "react";

import { Button, Form } from "semantic-ui-react";

import FormSelectColumn from "./FormSelectColumn";
import FormSelectOperators from "./FormSelectOperators";

export default function AttrWhere(props) {

    const { columns, query, changeData } = props;
    const { addWhere, setAddWhere } = props;
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

    const changeAttr = (name, value, item) => {
        changeAttrArray(null, { name, value, item });
    }

    const removeWhere = item => {
        let attr = [...query.attr];
        attr.splice(item, 1);
        changeData(null, { name: "attr", value: attr });
    }

    React.useEffect(() => {

        if (addWhere) {

            let attr = [...query.attr];
            attr.push({});

            changeData(null, { name: "attr", value: attr });
        }

        return () => setAddWhere(false);

    }, [addWhere]);

    return <div className="where-row">

        {query.attr.map((attr, i) => <Form.Group key={i}>
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
            <Form.Input
                label={i === 0 ? "Значение" : false}
                placeholder="Значение"
                width={10}
                // required
                name="value"
                value={attr.value || ""}
                item={i}
                onChange={changeAttrArray}
                disabled={loading || error}
            />

            {query.attr.length > 1
                ? <Button
                    icon="minus"
                    color="red"
                    title="Удалить условие"
                    onClick={() => removeWhere(i)}
                    style={{ height: "38px" }}
                    size="mini"
                    basic
                    disabled={loading || error}
                />
                : null
            }

            {/* {(i + 1) === query.attr.length
                ? <Button
                    icon="plus"
                    color="green"
                    title="Добавить еще условие"
                    onClick={addWhere}
                    style={{ height: "38px" }}
                    size="mini"
                    basic
                />
                : null
            } */}

        </Form.Group>)}

    </div>

}