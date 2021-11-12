import { useEffect, useState } from "react";
import axios from "./../../../../utils/axios-header";
import { Header, Loader, Message } from "semantic-ui-react";

import "./distributions.css";
import DistributionCallsRows from "./DistributionCallsRows";
import DistributionCallsSetting from "./DistributionCallsSettings";

const DistributionCalls = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [sectors, setSectors] = useState([]);

    useEffect(() => {

        axios.post('admin/getDistributionCalls').then(({ data }) => {
            setRows(data.rows);
            setSectors(data.sectors);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div style={{ maxWidth: 900 }}>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Распределение звонков"
                subheader="Настройка распределение звонков между секторами"
            />

        </div>

        <div className="admin-content-segment">

            {loading && <Loader inline="centered" active />}
            {!loading && error && <Message error content={error} />}

            {!loading && !error && <DistributionCallsRows
                sectors={sectors}
                setSectors={setSectors}
                setRows={setRows}
            />}

        </div>

        {!loading && !error && <div className="admin-content-segment">
            <p>Для использования распределения звонков на внешнем сервере необходимо отправить запрос по ссылке <a href={`${process.env.REACT_APP_INCOMING_DOMAIN}/api/getQueueSectorCall`}><code>{`${process.env.REACT_APP_INCOMING_DOMAIN}/api/getQueueSectorCall`}</code></a></p>
            <p>Для использования внутри локальной сети - <a href={`${process.env.REACT_APP_INCOMING_DOMAIN_LAN}/api/getQueueSectorCall`}><code>{`${process.env.REACT_APP_INCOMING_DOMAIN_LAN}/api/getQueueSectorCall`}</code></a>. Это необходимо для фиксации внутреннего ip-адреса сервера обращения</p>
            <p>Запрос будет возвращать идентификатор сектора колл-центра, идентификатор указан рядом с наименованием сектора: <code>#n</code></p>
        </div>}

        <DistributionCallsSetting rows={rows} setRows={setRows} />

    </div>

}

export default DistributionCalls;