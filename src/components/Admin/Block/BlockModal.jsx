import { useCallback, useEffect, useState } from "react";
import { Checkbox, Icon, Message, Modal, Placeholder } from "semantic-ui-react";
import { axios } from "../../../utils";

const BlockModal = props => {

    const { ip, open, close } = props;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sites, setSites] = useState([]);

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
                    {sites.map(row => <BlcokModalSiteRow
                        key={row.id}
                        row={row}
                    />)}
                </div>}

            </div>}

        </div>}
    />

}

const BlcokModalSiteRow = props => {

    const { row } = props;
    const [loading, setLoading] = useState(false);

    const setFullBlock = useCallback((checked, id) => {

        setLoading(true);

        axios.post('dev/block/setFullBlock', {
            checked, id
        }).then(({ data }) => {
            axios.toast(data.message, {
                type: "success",
                title: checked ? "Заблокировано" : "Разблокировано"
            });
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        });
    }, []);

    return <div key={row.id} className="d-flex my-3">
        <div className="flex-grow-1">{row.site}</div>
        <div>
            <Checkbox
                checked={row.is_block}
                onChange={(e, { checked }) => setFullBlock(checked, row.id)}
                label="Полная блокировка"
                toggle
                disabled={loading}
            />
        </div>
    </div>

}

export default BlockModal;