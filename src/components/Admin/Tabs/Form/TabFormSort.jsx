import { Form, Button, FormSelect } from "semantic-ui-react";
import FormSelectColumn from "./FormSelectColumn";

const TabFormSort = props => {

    const { columns, query, queryKey, queryEdit } = props;

    const changeAttr = (name, value, item) => {

        let data = {...query};
        data[name] = value;

        queryEdit(data, item);

    }

    return <div className="where-row my-3">

        <Form.Group>

            <FormSelectColumn
                columns={columns}
                width={10}
                changeAttr={changeAttr}
                value={query.column || ""}
                item={queryKey}
                noLabel
            />

            <FormSelect
                placeholder="Метод сортировки"
                options={[
                    { key: 0, text: "По возрастанию", value: "ASC" },
                    { key: 1, text: "По убыванию", value: "DESC" },
                ]}
                width={10}
                value={query.by || ""}
                onChange={(e, { value }) => changeAttr("by", value, queryKey)}
            />

        </Form.Group>

    </div>



}

export default TabFormSort;