import { useCallback, useEffect, useState } from "react";
import { Button, Form, Icon, Message, Modal } from "semantic-ui-react";
import { axios } from "../../../../utils";

const masks = [
    0x80000000,
    0xC0000000,
    0xE0000000,
    0xF0000000,
    0xF8000000,
    0xFC000000,
    0xFE000000,
    0xFF000000,
    0xFF800000,
    0xFFC00000,
    0xFFE00000,
    0xFFF00000,
    0xFFF80000,
    0xFFFC0000,
    0xFFFE0000,
    0xFFFF0000,
    0xFFFF8000,
    0xFFFFC000,
    0xFFFFE000,
    0xFFFFF000,
    0xFFFFF800,
    0xFFFFFC00,
    0xFFFFFE00,
    0xFFFFFF00,
    0xFFFFFF80,
    0xFFFFFFC0,
    0xFFFFFFE0,
    0xFFFFFFF0,
    0xFFFFFFF8,
    0xFFFFFFFC,
    0xFFFFFFFE,
    0xFFFFFFFF
];

// function parseMask(mask) {
//     var adr = parseAddress(mask);
//     if (0 == adr) {
//         if (isFinite(mask)) {
//             var nMask = Number(mask);
//             if (nMask >= 1 && nMask <= 30) {
//                 return masks[nMask - 1];
//             }
//         }
//         return 0;
//     }
//     for (var i = 0; i < masks.length; ++i) {
//         if (masks[i] == adr)
//             return adr;
//     }
//     return 0;
// }

const CreateBlockIp = props => {

    const { setRows, setBlock } = props;

    const [open, setOpen] = useState(false);

    const [ip, setIp] = useState("");
    const [start, setStart] = useState(null);
    const [stop, setStop] = useState(null);
    const [mask, setMask] = useState(0);
    const [maskPeriod, setMaskPeriod] = useState(null);

    const [save, setSave] = useState(false);
    const [error, setError] = useState(null);

    const onChange = useCallback(ip => {

        ip = String(ip).replaceAll(",", ".").replaceAll(/[a-zA-Zа-яА-Я!"№;%:?*()_+=@#$^&\\|]/g, '');

        let period = String(ip).split("-");
        let masks = String(ip).split("/");

        if (typeof period == "object" && period.length > 1) {
            setStart(period[0] === "" ? null : period[0]);
            setStop(period[1] === "" ? null : period[1]);
        } else {
            setStart(null);
            setStop(null);
        }

        if (typeof masks == "object" && masks.length > 1) {
            setMask(Number(masks[1]));
        } else {
            setMask(0);
        }

        setIp(ip);
    }, []);

    const regExIpV4 = useCallback(ip => {
        let reg = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/g;
        let bytes = reg.exec(ip);

        if (bytes === null || bytes.length != 5)
            return [0, 0, 0, 0];

        let a = Number(bytes[1]),
            b = Number(bytes[2]),
            c = Number(bytes[3]),
            d = Number(bytes[4]);

        return [a, b, c, d];
    }, []);

    const parseAddr = useCallback(ip => {

        let reg = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/g;
        let bytes = reg.exec(ip);

        if (bytes === null || bytes.length != 5)
            return 0;

        let a = Number(bytes[1]),
            b = Number(bytes[2]),
            c = Number(bytes[3]),
            d = Number(bytes[4]);

        let res = ((a & 0xFFFFFFFF) << 24)
            | ((b & 0xFFFFFFFF) << 16)
            | ((c & 0xFFFFFFFF) << 8)
            | (d & 0xFFFFFFFF);

        if (res < 0) res += 0x100000000;

        return res;
    }, []);

    const makeIP = useCallback(num => {
        return ((num & 0xFF000000) >>> 24) + "."
            + ((num & 0x00FF0000) >>> 16) + "."
            + ((num & 0x0000FF00) >>> 8) + "."
            + (num & 0x000000FF);
    }, [])

    useEffect(() => {
        if (open !== true) {
            setIp("");
            setStart(null);
            setStop(null);
            setSave(false);
            setError(null);
            setMask(null);
            setMaskPeriod(null);
        }
    }, [open]);

    useEffect(() => {

        if (mask > 0) {

            let invert = 0xFFFFFFFF - (masks[mask - 1] || 0);

            let [a, b, c, d] = regExIpV4(ip);
            let [e, f, g, h] = regExIpV4(makeIP(invert));
            let [i, j, k, l] = regExIpV4(makeIP(masks[mask - 1] || 0));

            let start = (a & i) + "." + (b & j) + "." + (c & k) + "." + (d & l);
            let stop = (a | e) + "." + (b | f) + "." + (c | g) + "." + (d | h);

            setMaskPeriod([start, stop]);
        } else {
            setMaskPeriod(null);
        }

    }, [mask, ip]);

    useEffect(() => {

        if (save) {

            axios.post('dev/block/create', {
                start: mask ? maskPeriod[0] : start,
                stop: mask ? maskPeriod[1] : stop,
                ip: ip,
                ipLong: parseAddr(ip),
                mask
            }).then(({ data }) => {

                setError(null);

                if (typeof setRows == "function") {
                    setRows(prev => {
                        let rows = [...prev];
                        rows.splice(rows.length, 1);
                        rows.unshift(data.row);
                        return rows;
                    });
                }

                setOpen(false);

                if (typeof setBlock == "function") {
                    setBlock(data.row.ip);
                }

            }).catch(e => {
                axios.setError(e, setError);
            }).then(() => {
                setSave(false);
            });
        }

    }, [save]);

    return <Modal
        open={open}
        trigger={<Button
            color="green"
            basic
            icon="plus"
            circular
            onClick={() => setOpen(open => !open)}
        />}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        centered={false}
        size="tiny"
        closeIcon={!save && <Icon name="close" fitted onClick={() => setOpen(false)} />}
        header="Новая блокировка"
        content={<div className="content position-relative">

            <Form loading={save} error={error ? true : false}>

                <Form.Input
                    placeholder="IP адрес, диапазон или подсеть"
                    fluid
                    value={ip}
                    onChange={(e, { value }) => onChange(value)}
                    className="mb-0"
                />

                {start && stop && <div className="mt-3">
                    По диапазону: <b>{start}{" - "}{stop}</b>
                </div>}

                {maskPeriod && <div className="mt-3">
                    Диапазон по маске: <b>{maskPeriod[0]}{" - "}{maskPeriod[1]}</b>
                </div>}

                <Message error content={error} className="mt-3" />

            </Form>

        </div>}
        actions={[
            {
                key: "save",
                content: "Сохранить",
                color: "green",
                icon: "save",
                labelPosition: "right",
                disabled: ip === "" || save,
                onClick: () => setSave(true),
            }
        ]}
    />

}

export default CreateBlockIp;