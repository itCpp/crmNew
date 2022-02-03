import { useEffect, useState } from "react";
import { axios } from "../../../utils";
import { Header, Loader, Message } from "semantic-ui-react";
import SettingsList from "./SettingsList";

const Settings = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    useEffect(() => {

        axios.post('dev/settings').then(({ data }) => {
            setError(null);
            setRows(data.settings);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="segment-compact">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Глобальные настройки"
                subheader="Семь раз подумай, один раз измени!"
                color="red"
            />

            {loading ? <Loader active inline /> : null}

        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <SettingsList
            rows={rows}
            setRows={setRows}
        />}

    </div>

}

export default Settings;