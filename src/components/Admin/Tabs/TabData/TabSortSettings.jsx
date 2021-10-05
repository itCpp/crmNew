import React from "react";
import axios from "./../../../../utils/axios-header";
import { Form, Message, Button } from "semantic-ui-react";
import TabFormSort from "./../Form/TabFormSort";
import TabSql from "./TabSql";

const TabSortSettings = props => {

    const { tab, tabs, setTabs, setTab } = props;
    const [formdata, setFormdata] = React.useState(tab);

    const [load, setLoad] = React.useState(false);
    const [globalError, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [save, setSave] = React.useState(false);

    const changeFormdata = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        setFormdata({ ...formdata, [e.name]: value });

    }

    const addQueryRow = () => {

        let data = { ...formdata };

        if (!data.order_by_settings)
            data.order_by_settings = [];

        data.order_by_settings.push({});
        setFormdata(data);

    }

    const queryEdit = (query, key) => {

        let data = [...formdata.order_by_settings];
        data[key] = query;

        setFormdata({ ...formdata, order_by_settings: data });

    }

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Условия сортировки</h3>
            <div>
                <Button
                    circular={true}
                    size="tiny"
                    icon="save"
                    color="green"
                    basic={tab === formdata}
                    disabled={tab === formdata}
                    loading={load}
                    title="Сохранить изменения"
                    onClick={() => setSave(true)}
                />
            </div>
        </div>

        <div className="position-relative mb-2">

        <Message size="mini" className="mt-3" content="Сформируйте условия сортировки строк. По умолчанию сортировка определена по дате добавления заявки (created_at) в порядке возрастания, т.е. новые строки будут всегда в начале таблицы" />

            {globalError
                ? <Message error content={globalError} />
                : null
            }

            <Form>

                {formdata.order_by_settings && formdata.order_by_settings.length > 0
                    ? formdata.order_by_settings.map((query, i) => <TabFormSort
                        key={i}
                        {...props}
                        formdata={formdata}
                        changeFormdata={changeFormdata}
                        error={false}
                        errors={errors}
                        query={query}
                        queryKey={i}
                        queryEdit={queryEdit}
                    // removeQueryRow={removeQueryRow}
                    />)
                    : <Message info size="tiny" className="mt-3" content="Добавьте условия сортировки строк" />
                }

                <div className="text-center">
                    <Button
                        content="Добавить условие"
                        color="green"
                        basic
                        icon="plus"
                        labelPosition="right"
                        onClick={addQueryRow}
                    />
                    <TabSql id={formdata.id} orderBy={formdata.order_by_settings} />
                </div>

            </Form>

        </div>

    </div>
}
export default TabSortSettings;