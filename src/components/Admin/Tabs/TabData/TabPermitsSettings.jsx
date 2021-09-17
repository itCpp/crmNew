import React from "react";
import axios from "./../../../../utils/axios-header";

import { Dimmer, Loader, Button, Message, Checkbox } from "semantic-ui-react";

export default function TabBasicSettings(props) {

    const { tab, tabs, setTabs, setTab } = props;
    const [formdata, setFormdata] = React.useState(tab);

    const [load, setLoad] = React.useState(false);
    const [globalError, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [save, setSave] = React.useState(false);

    const changeFormdata = (...a) => {

        const e = a[1] || a[0].currentTarget;

        if (e.disabled)
            return false;

        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        if (typeof setFormdata == "function") {
            setFormdata({ ...formdata, [e.name]: value });
        }

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

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Настройки прав доступа</h3>
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

            <Message
                size="mini"
                content="Все нижеперечисленные разрешения будут перекрывать разрешения, выданные лично сотруднику или группе, к которой он относится. За исключением разработчиков."
                className="mt-3"
            />

            {globalError
                ? <Message error content={globalError} />
                : null
            }

            <Checkbox
                toggle
                checked={formdata?.request_all_sector === 1 ? true : false}
                onClick={changeFormdata}
                label="Отобразить заявки своего сектора"
                className="permites-check"
                disabled
            />

            <Checkbox
                toggle
                checked={formdata?.request_all_callcenter === 1 ? true : false}
                onClick={changeFormdata}
                label="Отобразить заявки своего колл-центра"
                className="permites-check"
                disabled
            />

            <Checkbox
                toggle
                checked={formdata?.request_all === 1 ? true : false}
                onChange={changeFormdata}
                label="Отобразить все заявки ЦРМ"
                className="permites-check"
                disabled
            />

        </div>

    </div>

}