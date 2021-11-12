import { useEffect, useState, useCallback } from "react";
import axios from "./../../../../utils/axios-header";
import { Input, Checkbox, Button, Dimmer, Loader } from "semantic-ui-react";

const getCode = (rows, o = false) => {
    let code = "";

    if (o === true) {
        for (let i in rows)
            code += String(i) + String(rows[i]);
    }
    else {
        rows.forEach(row => {
            code += String(row.id) + String(row.count_change_queue);
        });
    }

    return code;
}

const DistributionCallsSettings = props => {

    const { rows, setRows } = props;
    const [checked, setChecked] = useState(null);
    const [label, setLabel] = useState([]);
    const [code, setCode] = useState(null);
    const [queue, setQueue] = useState({});
    const [loading, setLoading] = useState(false);
    const [save, setSave] = useState(false);

    useEffect(() => {

        if (rows && rows.length) {

            let only_queue = 1,
                label_xx = [];

            rows.forEach(row => {
                if (row.only_queue === 1)
                    only_queue = `only_${row.id}`;

                label_xx.push("x");
            });

            setChecked(only_queue);
            setLabel(label_xx.length > 0 ? label_xx : ["-", "-"]);
            setCode(getCode(rows));
            setLoading(false);

        }

    }, [rows]);

    const changeChecked = useCallback((e, { value }) => {

        setLoading(true);

        axios.post('admin/distributionSetOnly', { value }).then(({ data }) => {
            setRows(data.rows);
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const changeQueue = useCallback((e, { value, name }) => {
        setQueue(prev => ({ ...prev, [name]: value }));
    }, []);

    useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('admin/distributionSetCountQueue', queue).then(({ data }) => {
                setRows(data.rows);
                setQueue({});
            }).catch(e => {
                axios.toast(e);
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    if (rows && rows.length === 0)
        return null;

    return <div className="admin-content-segment">

        <div className="divider-header">
            <h3>Настройки распределения звонков</h3>
        </div>

        <div className="my-2 d-flex align-items-center">
            <Checkbox
                label={label.join("/")}
                checked={checked === 1}
                onChange={changeChecked}
                value={1}
            />
        </div>

        <div className="d-flex justify-content-center align-items-center">
            {rows.map(row => <div key={`only_${row.id}`} className="mx-2">
                <div title={row.comment} className="mb-1 px-1"><strong>{row.name}</strong></div>
                <Input
                    value={queue[row.id] || row.count_change_queue}
                    disabled={checked !== 1}
                    style={{ maxWidth: "100px" }}
                    onChange={changeQueue}
                    name={row.id}
                />
            </div>)}

        </div>

        {code !== getCode(queue, true) && Object.keys(queue).length > 0 && <div className="text-center">
            <Button
                color="green"
                icon="save"
                content="Сохранить"
                size="mini"
                className="ml-2 mt-1"
                disabled={checked !== 1}
                onClick={() => setSave(true)}
            />
        </div>}

        {rows.map(row => <div key={`only_${row.id}`} className="my-2">
            <Checkbox
                label={`Только ${row.name} (#${row.id})`}
                checked={checked === `only_${row.id}`}
                onChange={changeChecked}
                value={`only_${row.id}`}
            />
        </div>)}

        {loading && <Dimmer active inverted><Loader /></Dimmer>}

    </div>

}

export default DistributionCallsSettings;