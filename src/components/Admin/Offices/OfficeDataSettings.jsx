import React from "react";
import { Form, Button } from "semantic-ui-react";

const TYPE_SELECT = [
    { text: "Тип настройки", value: null },
    { text: "Шлюз СМС по умолчанию", value: "gate_default" },
    { text: "Шлюз СМС для сектора", value: "gate_for_sector" },
    { text: "Телефон секретаря для сектора", value: "phone_secretary_for_sector" },
];

const OfficeDataSettings = React.memo(props => {

    const { onChange } = props;
    const rows = props?.formdata?.settings || [{}];

    const changeRow = React.useCallback((e, { count, name, value }) => {

        rows[count] = { ...rows[count], [name]: value };

        if (name === "type" && value === null)
            rows[count] = {}

        onChange(null, { name: "settings", value: rows });

    }, [rows]);

    const addRow = React.useCallback(() => {
        rows.push({});
        onChange(null, { name: "settings", value: rows });
    }, [rows]);

    const removeRow = React.useCallback((key) => {
        delete (rows[key]);
        onChange(null, { name: "settings", value: rows });
    }, [rows]);

    return <div className="mt-3 mb-3">

        <div className="mb-2"><b>Прочие настройки</b></div>

        {rows && rows.length > 0 && rows.map((row, i) => <OfficeDataSettingsRow
            key={i}
            count={i}
            row={row}
            {...props}
            changeRow={changeRow}
            addRow={addRow}
            removeRow={removeRow}
        />)}

    </div>

});

const OfficeDataSettingsRow = props => {

    const { count, row, changeRow, addRow, removeRow } = props;

    return <Form.Group>

        <Form.Select
            options={TYPE_SELECT.map((option, i) => ({ ...option, key: i }))}
            placeholder="Тип настройки"
            count={count}
            name="type"
            value={row.type || null}
            onChange={changeRow}
            width={!row.type ? 16 : 6}
        />

        {row.type && <OfficeDataSettingsForm
            {...props}
            type={row.type || null}
        />}

        {count > 0 && <Button
            basic
            icon="minus"
            color="red"
            title="Удалить строку с настройкой"
            onClick={() => removeRow(count)}
        />}

        <Button
            basic
            icon="plus"
            color="green"
            title="Добавить еще настройку"
            onClick={addRow}
            className="mr-2"
        />

    </Form.Group>

}

const OfficeDataSettingsForm = props => {

    const { count, type, value, changeRow } = props;

    switch (type) {
        case "gate_default":
            return <>
                <SelectGate {...props} />
                <InputValue {...props} name="channel" placeholder="Номер канала" />
            </>
        case "gate_for_sector":
            return <>
                <SelectGate {...props} />
                <SelectSector {...props} />
                <InputValue {...props} name="channel" placeholder="Номер канала" />
            </>
        case "phone_secretary_for_sector":
            return <>
                <SelectSector {...props} />
                <InputValue {...props} placeholder="Укажите телефон" />
            </>
        default:
            return <InputValue {...props} width={10} />
    }

}

const SelectGate = props => {

    const { count, row, changeRow, gates } = props;

    return <Form.Select
        options={gates.map((option, i) => ({
            key: i,
            text: option.addr || null,
            value: option.id || null,
        }))}
        placeholder="Выберите шлюз"
        count={count}
        name="gate"
        value={row.gate || null}
        onChange={changeRow}
        width={props.width || 6}
    />
}

const SelectSector = props => {

    const { count, row, changeRow, sectors } = props;

    return <Form.Select
        options={sectors.map((option, i) => ({
            key: i,
            text: option.name || null,
            value: option.id || null,
        }))}
        placeholder="Выберите сектор"
        count={count}
        name="sector"
        value={row.sector || null}
        onChange={changeRow}
        width={props.width || 6}
    />
}

const InputValue = props => {

    const { count, row, changeRow } = props;

    return <Form.Input
        placeholder={props.placeholder || "Введите значение"}
        count={count}
        name={props.name || "value"}
        value={row[props.name || "value"] || ""}
        onChange={changeRow}
        width={props.width || 6}
    />
}

export default OfficeDataSettings;