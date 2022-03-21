import { useCallback, useEffect, useState } from "react";
import { Checkbox, Icon, Message, Modal, Placeholder } from "semantic-ui-react";
import { axios } from "../../../utils";

const BlockModal = props => {

    const { ip, open, close, setRows, callback } = props;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sites, setSites] = useState([]);

    const updateRow = data => {

        let is_blocked = false,
            blocks_all = true,
            is_autoblock = false;

        setSites(prev => {

            prev.forEach((row, i) => {

                if (row.id === data.id && typeof data.checked != "undefined") {
                    prev[i].is_block = data.checked;
                }

                if (row.id === data.id && typeof data.is_autoblock != "undefined") {
                    prev[i].is_autoblock = data.is_autoblock;
                }

                if (prev[i].is_block === true)
                    is_blocked = true;

                if (prev[i].is_block !== true)
                    blocks_all = false;

                if (prev[i].is_autoblock === true)
                    is_autoblock = true;
            });

            return prev;
        });

        if (typeof setRows == "function") {
            setRows(p => {
                let rows = [...p];

                rows.forEach((row, i) => {
                    if (row.ip === data.ip) {
                        rows[i].blocks_all = blocks_all;
                        rows[i].is_blocked = is_blocked;
                        rows[i].is_autoblock = is_autoblock;
                    }
                });
                return rows;
            });
        }

        if (typeof callback == "function")
            callback(data);
    }

    useEffect(() => {

        if (ip) {
            axios.post('dev/block/getip', { ip }).then(({ data }) => {
                setError(null);
                setSites(data.sites);
            }).catch(e => {
                axios.setError(e, setError);
            }).then(() => {
                setLoading(false)
            });
        }

    }, [ip]);

    return <Modal
        open={open}
        header={`Блокировка IP ${ip}`}
        centered={false}
        size="tiny"
        closeIcon={!loading && <Icon name="close" fitted onClick={close} />}
        closeOnEscape={false}
        closeOnEscape={false}
        content={<div className="content">

            {loading && <Placeholder fluid style={{ height: 48 }} className="rounded" />}

            {!loading && error && <Message error content={error} />}

            {!loading && !error && <div>

                {typeof sites == "object" && sites.length === 0 && <div className="text-center my-5 opacity-80">
                    <div><strong>Статистика на сайтах не настроена</strong></div>
                    <div><small>Чтобы настроить сайт, воспользуйтесь разделом <b>Базы сайтов</b></small></div>
                </div>}

                {typeof sites == "object" && sites.length > 0 && <div>

                    <Message
                        info
                        size="mini"
                        content={<div>Список сайтов настраивается в разделе <b>Базы сайтов</b>. Для актуальной информации о посещениях, каждый сайт должен иметь свою базу данных статистики.</div>}
                        className="mb-4"
                    />

                    {sites.map(row => <BlcokModalSiteRow
                        key={row.id}
                        row={row}
                        ip={ip}
                        updateRow={updateRow}
                    />)}
                </div>}

            </div>}

        </div>}
    />

}

const BlcokModalSiteRow = props => {

    const { row, ip, updateRow } = props;
    const [loading, setLoading] = useState(false);

    const setFullBlock = useCallback((checked, id) => {

        setLoading(true);

        axios.post('dev/block/site/setblockip', {
            checked, id, ip
        }).then(({ data }) => {
            axios.toast(data.message, {
                type: "success",
                title: checked ? "Заблокировано" : "Разблокировано"
            });
            updateRow({ ip, id, checked });
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        });
    }, []);

    const setAutoBlock = useCallback((checked, id) => {

        setLoading(true);

        axios.post('dev/block/site/setautoblockip', {
            checked, id, ip
        }).then(({ data }) => {
            axios.toast(`${data.is_autoblock ? "Включена" : "Отключена"} для IP ${data.message}`, {
                type: "success",
                title: "Автоблоировка"
            });
            updateRow({ ip, id, is_autoblock: data.is_autoblock });
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        });
    }, []);

    return <div key={row.id} className="d-flex my-2">
        <div className="flex-grow-1">

            <span>{row.site}</span>

            {row.is_autoblock && <Icon
                name="window close"
                color="yellow"
                className="ml-2"
                title="Автоматически заблокирован"
                link
                disabled={loading}
                onClick={() => setAutoBlock(!row.is_autoblock, row.id)}
            />}

        </div>
        <div>
            <Checkbox
                checked={row.is_block}
                onChange={(e, { checked }) => setFullBlock(checked, row.id)}
                disabled={loading}
                title={row.is_block ? "Разблокировать" : "Заблокировать"}
                toggle
            />
        </div>
    </div>

}

export default BlockModal;