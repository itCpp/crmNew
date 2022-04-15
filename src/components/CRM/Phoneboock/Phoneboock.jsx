import { axios } from "../../../utils";
import React from "react";
import { Icon, Label, Loader, Message } from "semantic-ui-react";
import { useSelector } from "react-redux";

const Phoneboock = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const online = useSelector(state => state.main.onlineId);

    React.useEffect(() => {

        setLoading(true);

        axios.get('phoneboock').then(({ data }) => {
            setError(null);
            setRows(data.rows);
        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
        });

    }, [props.location.key]);

    return <div className="pb-3 px-2 w-100" id="sms-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Схема связи внутренних номеров</h4>
            </div>
        </div>

        <div className="block-card mb-3 px-2">

            <Loader
                active={loading}
                inline="centered"
            />

            {error && !loading && <Message
                error
                content={error}
                className="m-0"
            />}

            {!loading && !error && rows.length === 0 && <div className="opacity-50 my-4 text-center">
                <small>Нет активных учетных записей</small>
            </div>}

            {!loading && rows.length > 0 && rows.map((row, i) => <div
                key={`${i}_${row.number}`}
                className="my-1"
                children={<div className="d-flex align-items-center py-2 px-3 rounded bg-light">
                    <div className="flex-grow-1">
                        <b>{row.pin}</b>{' '}
                        <span>{row.user}</span>
                    </div>
                    <div>
                        <Icon name="phone" />
                        <span>{row.number}</span>
                        {online.indexOf(row.id) >= 0 && <Label
                            size="tiny"
                            color="green"
                            empty
                            circular
                            className="ml-2"
                            title="Сейчас на сайте"
                        />}
                    </div>
                </div>}
            />)}

        </div>

    </div>
}

export default Phoneboock;