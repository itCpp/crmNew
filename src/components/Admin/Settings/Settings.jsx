import { useEffect, useState } from "react";
import { axios } from "../../../utils";
import { Header, Loader, Message } from "semantic-ui-react";
import SettingsList from "./SettingsList";
import SettingEdit from "./SettingEdit";

const Settings = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [row, setRow] = useState(null);

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
                subheader="Набор системных настроек изменение которых может повлиять на многое, прежде их менять необходимо проконсультироваться со специалистом"
                color="red"
            />

            {loading ? <Loader active inline /> : null}

        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <SettingsList
            rows={rows}
            setRows={setRows}
            edit={setRow}
        />}

        {row && <SettingEdit
            row={row}
            setShow={setRow}
            setRows={setRows}
        />}

    </div>

}

export default Settings;