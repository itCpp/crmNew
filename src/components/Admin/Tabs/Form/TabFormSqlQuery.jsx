import { Form, Button } from "semantic-ui-react";

import FormSelectWhere from "./FormSelectWhere";
import FormWhereAttr from "./FormWhereAttr";

export default function TabFormSqlQuery(props) {

    const { query, queryKey, queryEdit, removeQueryRow } = props;

    const changeData = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        let data = { ...query, [e.name]: value };

        if (e.name === "where" && !query.attr)
            data.attr = [];

        if (!data.attr.length)
            data.attr.push({});

        queryEdit(data, queryKey);

    }

    return <div className="where-block">

        <Form.Group>
            <FormSelectWhere {...props} changeData={changeData} />
            <Button
                icon="trash"
                title="Удалить выражение"
                onClick={() => removeQueryRow(queryKey)}
                style={{ height: "38px" }}
                size="mini"
                basic
            />
        </Form.Group>

        {query.where
            ? <FormWhereAttr {...props} changeData={changeData} />
            : null
        }

    </div>

}