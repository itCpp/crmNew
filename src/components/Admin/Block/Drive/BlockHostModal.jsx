import { useCallback, useEffect, useState } from "react";
import { Checkbox, Dimmer, Icon, Input, Loader, Message, Modal, Placeholder } from "semantic-ui-react";
import { axios } from "../../../../utils";

const BlockHostModal = props => {

    const { host, open, close, setRows, setHost } = props;

    const [hostname, setHostname] = useState(typeof host == "string" ? host : "");
    const [change, setChange] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sites, setSites] = useState([]);

    const updateRow = data => {

        let is_blocked = false,
            blocks_all = true;

        setSites(prev => {

            prev.forEach((row, i) => {

                if (row.id === data.id) {
                    prev[i].is_block = data.checked;
                }

                if (prev[i].is_block === true)
                    is_blocked = true;

                if (prev[i].is_block !== true)
                    blocks_all = false;
            });

            return prev;
        });

        if (typeof setRows == "function") {
            setRows(p => {
                let rows = [...p];

                rows.forEach((row, i) => {
                    if (row.host === data.host) {
                        rows[i].blocks_all = blocks_all;
                        rows[i].is_blocked = is_blocked;
                    }
                });
                return rows;
            });
        }
    }

    useEffect(() => {

        if (host === true) return setLoading(false);

        if (host) {

            setLoading(true);

            axios.post('dev/block/gethost', { host }).then(({ data }) => {
                setError(null);
                setSites(data.sites);
            }).catch(e => {
                axios.setError(e, setError);
            }).then(() => {
                setLoading(false);
            });
        }

    }, [host]);

    useEffect(() => {

        if (change) {

            axios.put('dev/block/sethost', { host, hostname }).then(({ data }) => {

                setHost(data.hostname);

                if (typeof setRows == "function") {

                    setRows(p => {

                        let rows = [...p],
                            create = true;

                        rows.forEach((row, i) => {
                            if (row.host === host) {
                                rows[i].host = data.hostname;
                                create = false;
                            }
                        });

                        if (create) {
                            rows.unshift({
                                host: data.hostname,
                                blocks: [],
                            });
                        }

                        return rows;
                    });
                }

            }).catch(e => {
                axios.toast(e);
            }).then(() => {
                setChange(false);
            });
        }

    }, [change]);

    return <Modal
        open={open}
        header="Блокировка хоста"
        centered={false}
        size="tiny"
        closeIcon={!loading && <Icon name="close" fitted onClick={close} />}
        closeOnEscape={false}
        closeOnEscape={false}
        content={<div className="content position-relative">

            <Dimmer active={loading} inverted><Loader /></Dimmer>

            {!loading && error && <Message error content={error} />}

            <div className="mb-3">
                <Input
                    value={hostname}
                    onChange={(e, { value }) => setHostname(value)}
                    placeholder="Введите полное имя хоста или его часть"
                    fluid
                    disabled={change}
                    action={{
                        icon: "save",
                        color: "green",
                        disabled: (hostname === host || hostname === "" || change),
                        loading: change,
                        onClick: () => setChange(true),
                    }}
                />
            </div>

            {!error && host !== true && <div>

                {!loading && typeof sites == "object" && sites.length === 0 && <div className="text-center my-5 opacity-80">
                    <div><strong>Статистика на сайтах не настроена</strong></div>
                    <div><small>Чтобы настроить сайт, воспользуйтесь разделом <b>Базы сайтов</b></small></div>
                </div>}

                {typeof sites == "object" && sites.length > 0 && <div>
                    {sites.map(row => <BlockModalSiteRow
                        key={row.id}
                        row={row}
                        host={host}
                        updateRow={updateRow}
                        disabled={host !== hostname || change}
                    />)}
                </div>}

            </div>}

        </div>}
    />

}

const BlockModalSiteRow = props => {

    const { row, host, disabled, updateRow } = props;
    const [loading, setLoading] = useState(false);

    const setFullBlock = useCallback((checked, id) => {

        setLoading(true);

        axios.post('dev/block/site/setblockhost', {
            checked, id, host
        }).then(({ data }) => {

            axios.toast(data.message, {
                type: "success",
                title: checked ? "Заблокировано" : "Разблокировано"
            });

            updateRow({ host, id, checked });

        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        });
    }, []);

    return <div key={row.id} className="d-flex mt-2">
        <div className="flex-grow-1">{row.site}</div>
        <div>
            <Checkbox
                checked={row.is_block}
                onChange={(e, { checked }) => setFullBlock(checked, row.id)}
                toggle
                disabled={loading || disabled}
            />
        </div>
    </div>

}

export default BlockHostModal;