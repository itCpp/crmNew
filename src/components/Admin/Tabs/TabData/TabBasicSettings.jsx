import React from "react";
import axios from "./../../../../utils/axios-header";

import { Dimmer, Loader, Form, Message, Button } from "semantic-ui-react";

import TabFormName from "./../Form/TabFormName";

export default function TabBasicSettings(props) {

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
                setFormdata(data.tab);

            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoad(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Основные настройки</h3>
            <div>
                <Button
                    circular={true}
                    size="tiny"
                    icon="save"
                    color="green"
                    basic={tab === formdata}
                    disabled={tab === formdata}
                    loading={load}
                    title="Созранить изменения"
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

                <TabFormName
                    formdata={formdata}
                    changeFormdata={changeFormdata}
                    error={false}
                    errors={errors}
                />

            </Form>

        </div>

    </div>

}