import React from "react";
import axios from "./../../../../utils/axios-header";

import { Dimmer, Loader, Form, Message, Button } from "semantic-ui-react";

import TabFormSqlQuery from "./../Form/TabFormSqlQuery";

export default function TabQuerySettings(props) {

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

        if (typeof setFormdata == "function") {
            setFormdata({ ...formdata, [e.name]: value });
        }

    }

    const addQueryRow = () => {

        let data = { ...formdata };

        if (!data.where_settings)
            data.where_settings = [];

        data.where_settings.push({});
        setFormdata(data);

    }

    const removeQueryRow = key => {

        let data = { ...formdata };
        data.where_settings.splice(key, 1);
        setFormdata(data);

    }

    const queryEdit = (query, key) => {

        let data = [...formdata.where_settings];
        data[key] = query;

        setFormdata({ ...formdata, where_settings: data });

    }

    React.useEffect(() => {
        setFormdata(tab);
    }, [tab]);

    React.useEffect(() => {

        if (save) {

            setLoad(true);

            axios.post('dev/saveTab', formdata).then(({ data }) => {

                setError(false);

                tabs.find((r, k, a) => {
                    if (r.id === formdata.id) {
                        a[k] = data.tab;
                        setTabs(a);
                        return true;
                    }
                });

                setTab(data.tab);

            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoad(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    // React.useEffect(() => console.log(formdata), [formdata]);

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Настройки запроса выборки</h3>
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

            {globalError
                ? <Message error content={globalError} />
                : null
            }

            <Form>

                {formdata.where_settings && formdata.where_settings.length > 0
                    ? formdata.where_settings.map((query, i) => <TabFormSqlQuery
                        key={i}
                        {...props}
                        formdata={formdata}
                        changeFormdata={changeFormdata}
                        error={false}
                        errors={errors}
                        query={query}
                        queryKey={i}
                        queryEdit={queryEdit}
                        removeQueryRow={removeQueryRow}
                    />)
                    : <Message info size="tiny" className="mt-3" content="Добавьте условия выбора" />
                }

                <div className="text-center">
                    <Button
                        content="Добавить выражение"
                        color="green"
                        basic
                        icon="plus"
                        labelPosition="right"
                        onClick={addQueryRow}
                    />
                </div>

            </Form>

        </div>

    </div>

}