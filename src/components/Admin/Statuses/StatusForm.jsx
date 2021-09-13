import React from "react";
import { Form } from "semantic-ui-react";

function StatusForm(props) {

    const { load, error, errors } = props;
    const { formdata, setFormdata } = props;

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
    ]

    return <Form loading={load}>

        <Form.Input
            placeholder="Укажите наименование статуса..."
            label="Наименование статуса"
            name="name"
            value={formdata.name || ""}
            onChange={changeFormdata}
            disabled={error ? true : false}
            error={errors.name || false}
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
            error={errors.time || false}
            error={errors.time ? true : false}
        />

    </Form>

}

export default StatusForm;