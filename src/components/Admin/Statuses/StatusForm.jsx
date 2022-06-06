import React from "react";
import { Button, Form, Select, Dropdown, Icon, Input } from "semantic-ui-react";
import { themes } from "./Statuses";

function StatusForm(props) {

    const { load, error, errors, settings } = props;
    const { formdata, setFormdata, loaded } = props;
    const [settingsData, setSettingsData] = React.useState([]);

    const changeFormdata = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        if (typeof setFormdata == "function") {
            setFormdata({ ...formdata, [e.name]: value });
        }

    }

    const changeFormdataZeroing = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        if (typeof setFormdata == "function") {
            const zeroing_data = { ...formdata.zeroing_data, [e.name]: value }
            setFormdata({ ...formdata, zeroing_data });
        }

    }

    const onChangeSetting = (item, name, value) => {

        setSettingsData(prev => {

            const settings = [...prev];

            if (typeof settings[item] == "undefined")
                settings[item] = {};

            settings[item][name] = value;

            return settings;
        });
    }

    const addColumnSetting = () => setSettingsData(prev => {
        let rows = [...prev];
        rows.push({});
        return rows;
    });

    const dropColumnSetting = item => setSettingsData(prev => {
        let rows = [];
        prev.forEach((row, i) => {
            if (i !== item) {
                rows.push(row);
            }
        });
        return rows;
    });

    React.useEffect(() => {
        let rows = [];
        for (let i in (formdata?.settings || {})) {
            rows.push({ key: i, value: formdata.settings[i] });
        }
        setSettingsData(rows);
    }, [loaded]);

    React.useEffect(() => {

        setFormdata(data => {

            const settings = { ...(data?.settings || {}) }

            settingsData.forEach(row => {
                settings[row.key] = row.value || null;
            });

            return { ...data, settings }
        });

    }, [settingsData]);

    // React.useEffect(() => console.log(formdata), [formdata]);

    const options = [
        {
            key: 0,
            text: "Не выбран",
            value: null,
            name: "algorithm",
            onClick: changeFormdataZeroing
        },
        {
            key: 1,
            text: "Через n часов",
            value: "xHour",
            name: "algorithm",
            onClick: changeFormdataZeroing
        },
        {
            key: 2,
            text: "На следующий день",
            value: "nextDay",
            name: "algorithm",
            onClick: changeFormdataZeroing
        },
        {
            key: 3,
            text: "Через n дней",
            value: "xDays",
            name: "algorithm",
            onClick: changeFormdataZeroing
        },
    ];

    return <Form loading={load}>

        <Form.Group widths="equal">

            <Form.Input
                placeholder="Укажите наименование статуса..."
                label="Наименование статуса"
                name="name"
                value={formdata.name || ""}
                onChange={changeFormdata}
                disabled={error ? true : false}
                error={errors.name || false}
            />

            <Form.Field>
                <label>Тема оформления</label>
                <Dropdown
                    placeholder="Оформление"
                    selection
                    options={themes.map((o, i) => ({
                        ...o,
                        key: i,
                        as: () => <div
                            className={`request-row-select-item request-row request-row-theme-${o.value} ${o.value === formdata.theme ? `active` : ``}`}
                            onClick={() => setFormdata({ ...formdata, theme: o.value })}
                        >
                            {o.value === formdata.theme && <Icon name="check" />}
                            <span>{o.text}</span>
                        </div>,
                    }))}
                    // onChange={(e, { value }) => props.changeTheme({ id: row.id, theme: value })}
                    value={formdata.theme}
                    disabled={load ? true : false}
                />
            </Form.Field>

        </Form.Group>

        <Form.Checkbox
            toggle
            label="Необходимо указать время события"
            name="event_time"
            checked={formdata.event_time === 1 ? true : false}
            onChange={changeFormdata}
            disabled={error ? true : false}
        />

        <hr />

        <div className="field mb-2">
            <label>Настройки обнуления</label>
        </div>

        <Form.Checkbox
            toggle
            label="Обнуление заявки при поступлении"
            name="zeroing"
            checked={formdata.zeroing === 1 ? true : false}
            onChange={changeFormdata}
            disabled={error ? true : false}
        />

        <Form.Group widths="equal">

            <Form.Select
                fluid
                placeholder="Алгоритм обнуления"
                name="algorithm"
                value={formdata.zeroing_data?.algorithm || ""}
                options={options}
                disabled={error || formdata.zeroing !== 1 ? true : false}
                width={12}
                error={errors.algorithm || false}
            />

            <Form.Input
                fluid
                placeholder="Значние"
                type="number"
                name="algorithm_option"
                value={formdata.zeroing_data?.algorithm_option || ""}
                onChange={changeFormdataZeroing}
                disabled={error || formdata.zeroing !== 1 || ["xHour", "xDays"].indexOf(formdata.zeroing_data?.algorithm) < 0 ? true : false}
                step={1}
                width={4}
                error={errors.algorithm_option ? true : false}
            />

        </Form.Group>

        <Form.Checkbox
            label="Учитывать время поступления в ЦРМ"
            name="time_created"
            checked={formdata.zeroing_data?.time_created === 1 ? true : false}
            onChange={changeFormdataZeroing}
            disabled={error || formdata.zeroing !== 1 ? true : false}
            error={errors.time ? true : false}

        />

        <Form.Checkbox
            label="Учитывать время обновления заявки"
            name="time_updated"
            checked={formdata.zeroing_data?.time_updated === 1 ? true : false}
            onChange={changeFormdataZeroing}
            disabled={error || formdata.zeroing !== 1 ? true : false}
            error={errors.time ? true : false}
        />

        <Form.Checkbox
            label="Учитывать время события"
            name="time_event"
            checked={formdata.zeroing_data?.time_event === 1 ? true : false}
            onChange={changeFormdataZeroing}
            disabled={error || formdata.zeroing !== 1 ? true : false}
            error={errors.time ? true : false}
        />

        <hr />

        {settingsData.length === 0 && <SettingStatusRow
            add
            settings={settings}
            onChangeSetting={onChangeSetting}
            addColumnSetting={addColumnSetting}
        />}

        {settingsData.length > 0 && settingsData.map((row, i) => <SettingStatusRow
            key={i}
            item={i}
            row={row}
            settings={settings}
            add={i === (settingsData.length - 1)}
            onChangeSetting={onChangeSetting}
            addColumnSetting={addColumnSetting}
            dropColumnSetting={dropColumnSetting}
        />)}

    </Form>

}

const SettingStatusRow = props => {

    const { item, row, settings, add } = props;
    const { onChangeSetting, addColumnSetting, dropColumnSetting } = props;
    const [input, setInput] = React.useState(null);

    React.useEffect(() => {

        if (row?.key) {

            let input = null;

            settings.forEach(setting => {

                if (row.key === setting.name) {

                    if (setting.type === "array")
                        input = setting.data
                }
            });

            setInput(input || "string");
        }

    }, [row?.key]);

    return <div className="d-flex align-items-center mt-2">

        <Select
            options={[{ text: "Не выбрано", name: null }, ...settings].map((row, i) => ({
                key: i,
                text: row.text || row.name,
                value: row.name,
            }))}
            className="m-0"
            onChange={(e, { value }) => onChangeSetting(item || 0, "key", value)}
            value={row?.key || null}
            placeholder="Тип настройки"
        />

        <div className="ml-1 flex-grow-1">

            {typeof input == "object" && input !== null && <Select
                fluid
                options={[{ key: "0_null", text: "Не выбрано", value: null }, ...(input || [])]}
                onChange={(e, { value }) => onChangeSetting(item, 'value', value)}
                value={row?.value || null}
                disabled={!Boolean(row?.key)}
            />}

            {input === "string" && <Input
                fluid
                disabled={!Boolean(row?.key)}
                onChange={(e, { value }) => onChangeSetting(item, 'value', value)}
                value={row?.value || ""}
            />}

            {input === null && <Input
                fluid
                disabled={true}
            />}

        </div>

        <Button
            icon="minus"
            color="red"
            basic
            className="mb-0 mr-0 ml-2"
            onClick={() => dropColumnSetting(item)}
        />

        {add && <Button
            icon="plus"
            color="green"
            basic
            className="mb-0 mr-0 ml-2"
            onClick={addColumnSetting}
        />}

    </div>
}

export default StatusForm;