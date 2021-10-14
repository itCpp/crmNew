import React from "react";
import axios from "./../../../../utils/axios-header";

import { Button, Message, Checkbox, Radio, Popup } from "semantic-ui-react";

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

    const changeDateTypes = (e, { name, value, checked }) => {

        let types = formdata.date_types ? { ...formdata.date_types } : {};

        if (checked)
            types[value] = checked;

        if (!checked && types[value])
            delete (types[value]);

        setFormdata({ ...formdata, [name]: types });

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

            {/* <Message
                size="mini"
                content="Все нижеперечисленные настройки будут иметь приоритет перед разрешениями, выданными лично сотруднику или группе, к которой он относится"
                className="mt-3"
            /> */}

            {globalError && <Message error content={globalError} />}

            <div className="mb-2"><b>Публичные настройки вывода заявок</b></div>

            <Radio
                name="request_all"
                onClick={changeFormdata}
                checked={formdata?.request_all === "my" || formdata?.request_all === null ? true : false}
                value="my"
                label="Отобразить только свои заявки"
                className="permites-check d-block mb-2"
            />

            <Radio
                name="request_all"
                onClick={changeFormdata}
                checked={formdata?.request_all === "sector" ? true : false}
                value="sector"
                label="Отобразить все заявки своего сектора"
                className="permites-check d-block mb-2"
            />

            <Radio
                name="request_all"
                onClick={changeFormdata}
                checked={formdata?.request_all === "callcenter" ? true : false}
                value="callcenter"
                label="Отобразить все заявки своего колл-центра"
                className="permites-check d-block mb-2"
            />

            <Radio
                name="request_all"
                onChange={changeFormdata}
                checked={formdata?.request_all === "all" ? true : false}
                value="all"
                label="Отобразить все заявки ЦРМ"
                className="permites-check d-block mb-2"
            />

            <Popup
                content="Включая эту опцию, все вышеперечисленные условия будут перепроверяться по личным разрешениям сотрудника"
                size="mini"
                trigger={<Checkbox
                    toggle
                    name="request_all_permit"
                    onChange={changeFormdata}
                    checked={formdata?.request_all_permit === 1 ? true : false}
                    label="Учитывать настройки разрешений сотрудника"
                    className="permites-check d-block mb-2"
                />}
            />
            
            <small>Вышеперечисленные настройки будут иметь приоритет перед установленными разрешениями сотрудника и его ролей. Для учета разрешений сотрудника необходимо включить опцию учета настроек</small>

            <hr className="admin-segment-hr" />

            <div className="mb-2"><b>Проверяемые даты</b></div>

            <Checkbox
                name="date_types"
                onChange={changeDateTypes}
                checked={formdata?.date_types?.created_at ? true : false}
                value="created_at"
                label="Дата создания заявки"
                className="permites-check d-block mb-2"
            />

            <Checkbox
                name="date_types"
                onChange={changeDateTypes}
                checked={formdata?.date_types?.uplift_at ? true : false}
                value="uplift_at"
                label="Дата и время подъема в списке (повторное обращение)"
                className="permites-check d-block mb-2"
            />

            <Checkbox
                name="date_types"
                onChange={changeDateTypes}
                checked={formdata?.date_types?.event_at ? true : false}
                value="event_at"
                label="Дата события: записи, прихода и тд"
                className="permites-check d-block mb-2"
            />

            <Checkbox
                name="date_types"
                onChange={changeDateTypes}
                checked={formdata?.date_types?.updated_at ? true : false}
                value="updated_at"
                label="Дата обновления заявки (время любого изменения)"
                className="permites-check d-block mb-2"
            />

            <small>При отсутствии выбора будет учитываться дата создания. При выборе нескольких полей, будут показаны заявки, попадающие в выбранный диапазон дат одного из полей</small>

            <hr className="admin-segment-hr" />

            <div className="mb-2"><b>Прочие настройки</b></div>

            <Checkbox
                toggle
                name="date_view"
                onChange={changeFormdata}
                checked={formdata?.date_view === 1 ? true : false}
                label="Показывать за все время (без учета выбранной даты)"
                className="permites-check d-block mb-2"
            />

        </div>

    </div>

}