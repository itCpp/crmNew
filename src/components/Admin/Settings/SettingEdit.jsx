import { useEffect, useState } from "react";
import { Checkbox, Header, Modal } from "semantic-ui-react"
import { axios } from "../../../utils";

const SettingEdit = props => {

    const { row, setRows, setShow } = props;
    const [formdata, setFormdata] = useState({
        id: row.id,
        type: row.type,
        value: row.value,
    });

    const [save, setSave] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (save) {

            axios.post('dev/settings/set', formdata).then(({ data }) => {
                setRows(rows => {
                    let update = false;
                    rows.map((row, i) => {
                        if (row.id === data.setting.id) {
                            rows[i] = data.setting;
                            update = true;
                        }
                    });
                    if (!update) rows.push(data.setting);
                    return rows;
                })
                setShow(null);
            }).catch(e => {
                setSave(false);
                setError(true);
                axios.toast(e);
            });

        }

    }, [save]);

    return <Modal
        header="Изменение настройки"
        open={row ? true : false}
        closeOnDimmerClick={false}
        size="tiny"
        centered={false}
        actions={[
            {
                key: "cansel",
                content: "Отмена",
                onClick: () => setShow(null),
                disabled: save,
            },
            {
                key: "done",
                content: "Сохранить",
                positive: error ? false : true,
                negative: error ? true : false,
                onClick: () => setSave(true),
                loading: save,
                disabled: save || formdata.value === row.value,
            }
        ]}
        content={<div className="content">

            <Header as="b" content={row.id} subheader={row.comment} />

            {(row.type === "bool" || row.type === "boolean") && <div className="mt-4">
                <Checkbox
                    toggle
                    checked={formdata.value}
                    disabled={save}
                    label={row.value ? "Настройка включена" : "Настройка отключена"}
                    onChange={(e, { checked }) => setFormdata(d => ({ ...d, value: checked }))}
                />
            </div>}

        </div>}
    />

}

export default SettingEdit;