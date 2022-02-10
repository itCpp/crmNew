import React from "react";
import { Checkbox, Radio, Popup, Icon } from "semantic-ui-react";

export default function TabBasicSettings(props) {

    const { row, setFormdata } = props;
    const { loading, error, errors } = props;

    const changeDateTypes = (e, { name, value, checked }) => {

        let types = row.date_types ? { ...row.date_types } : {};

        if (checked)
            types[value] = checked;

        if (!checked && types[value])
            delete (types[value]);

        if (Object.keys(types).length === 0)
            types = [];

        setFormdata(e, { name, value: types });
    }

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Настройки прав доступа</h3>
            <Popup
                basic
                content={<>
                    <div><b>Публичные настройки</b></div>
                    <div><small>Данные настройки определяют доступ к заявкам выбранной вкладки. Например во вкладке <b>БК</b> должен быть доступ ко всем заявкам своего сектора, если установить соответсвующую галочку на <b>Отобразить все заявки своего сектора</b>, то сотруднику будут доступны заявки с БК по всему сектору.</small></div>
                    <div><small>Переключатель <b>Учитывать настройки разрешений сотрудника</b> служит для переопределения выбранных опций. Например, ранее была установлена опция <b>Отобразить все заявки своего сектора</b> и, если у сотрудника имеется разрешение на вывод заявок всего колл-центра, то он получит доступ ко всем заявкам своего колл-центра</small></div>
                    <div><small><b className="text-danger">Важно!</b> При создании учетной записи сотрудника, необходимо указать колл-центр и сектор к которому он принадлежит, в противном случае опции вывода заявок будут идентичны выводу для администраторов сайта</small></div>
                </>}
                trigger={<span><Icon name="info circle" fitted link /></span>}
                wide="very"
            />
        </div>

        <div className="position-relative mb-2">

            <div className="mb-2"><b>Публичные настройки вывода заявок</b></div>

            <Radio
                name="request_all"
                onClick={setFormdata}
                checked={row.request_all === "my" || row.request_all === null ? true : false}
                value="my"
                label="Отобразить только свои заявки"
                className="permites-check d-block mb-2"
                disabled={loading || error}
            />

            <Radio
                name="request_all"
                onClick={setFormdata}
                checked={row.request_all === "sector" ? true : false}
                value="sector"
                label="Отобразить все заявки своего сектора"
                className="permites-check d-block mb-2"
                disabled={loading || error}
            />

            <Radio
                name="request_all"
                onClick={setFormdata}
                checked={row.request_all === "callcenter" ? true : false}
                value="callcenter"
                label="Отобразить все заявки своего колл-центра"
                className="permites-check d-block mb-2"
                disabled={loading || error}
            />

            <Radio
                name="request_all"
                onChange={setFormdata}
                checked={row.request_all === "all" ? true : false}
                value="all"
                label="Отобразить все заявки ЦРМ"
                className="permites-check d-block mb-2"
                disabled={loading || error}
            />

            <Popup
                content="Включая эту опцию, все вышеперечисленные условия будут перепроверяться по личным разрешениям сотрудника"
                size="mini"
                trigger={<Checkbox
                    toggle
                    name="request_all_permit"
                    onChange={setFormdata}
                    checked={row.request_all_permit === 1 ? true : false}
                    label="Учитывать настройки разрешений сотрудника"
                    className="permites-check d-block mb-2 mt-3"
                    disabled={loading || error}
                />}
            />

            <small>Вышеперечисленные настройки будут иметь приоритет перед установленными разрешениями сотрудника и его ролей. Для учета разрешений сотрудника необходимо включить опцию учета настроек. <span className="text-info">В большинстве случаев настройка учета личных разрешений сотрудника <b>должна быть включена</b>.</span></small>

            <hr className="admin-segment-hr" />

            <div className="mb-2"><b>Проверяемые даты</b></div>

            <Checkbox
                name="date_types"
                onChange={changeDateTypes}
                checked={row?.date_types?.created_at ? true : false}
                value="created_at"
                label="Дата создания заявки"
                className="permites-check d-block mb-2"
                disabled={loading || error || row.date_view === 1}
            />

            <Checkbox
                name="date_types"
                onChange={changeDateTypes}
                checked={row?.date_types?.uplift_at ? true : false}
                value="uplift_at"
                label="Дата и время подъема в списке (повторное обращение)"
                className="permites-check d-block mb-2"
                disabled={loading || error || row.date_view === 1}
            />

            <Checkbox
                name="date_types"
                onChange={changeDateTypes}
                checked={row?.date_types?.event_at ? true : false}
                value="event_at"
                label="Дата события: записи, прихода и тд"
                className="permites-check d-block mb-2"
                disabled={loading || error || row.date_view === 1}
            />

            <Checkbox
                name="date_types"
                onChange={changeDateTypes}
                checked={row?.date_types?.updated_at ? true : false}
                value="updated_at"
                label="Дата обновления заявки (время любого изменения)"
                className="permites-check d-block mb-2"
                disabled={loading || error || row.date_view === 1}
            />

            <small>При отсутствии выбора будет учитываться дата создания. При выборе нескольких полей, будут показаны заявки, попадающие в выбранный диапазон дат одного из полей</small>

            <hr className="admin-segment-hr" />

            <div className="mb-2"><b>Прочие настройки</b></div>

            <Checkbox
                toggle
                name="date_view"
                onChange={setFormdata}
                checked={row.date_view === 1 ? true : false}
                label="Показывать за все время (без учета выбранной даты)"
                className="permites-check d-block mb-2"
            />

        </div>

    </div>

}