import { useEffect, useState } from "react";
import { Dimmer, Loader, Modal } from "semantic-ui-react";
import { axios, moment } from "../../../../utils";

const ShowIpInfo = props => {

    const { open, close, ip } = props;
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (ip) {

            setLoading(true);

            axios.post('dev/block/ipInfo', { ip })
                .then(({ data }) => {
                    setData(data);
                })
                .catch(e => {
                    setError(axios.getError(e));
                })
                .then(() => {
                    setLoading(false);
                });

        }

        return () => {
            setError(null);
            setData({});
        }

    }, [ip])

    return <Modal
        open={open}
        onClose={close}
        centered={false}
        size="small"
        header={ip}
        closeIcon
        content={<div className="content">

            {loading && <div className="py-4 position-relative">
                <Dimmer active inverted>
                    <Loader active inline="centered" />
                </Dimmer>
            </div>}

            {!loading && Boolean(data.textInfo) && data.textInfo.map((row, i) => <div>

                {i > 0 && <hr className="hr-list" />}

                <div className="d-flex justify-content-between align-items-center">
                    <b>{row?.name || ""}</b>
                    <small title="Дата получения информации">{moment(row.datetime).format("DD.MM.YYYY HH:mm")}</small>
                </div>
                <pre className="mt-1">{row.data}</pre>
            </div>)}
        </div>}
    />

}

export default ShowIpInfo;