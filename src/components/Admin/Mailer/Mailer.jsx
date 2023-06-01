import { useEffect, useState } from "react";
import { Button, Header, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import MaillerEdit from "./MaillerEdit";
import MaillerRow from "./MaillerRow";

const Mailer = props => {

    const [loading, setLoading] = useState(true);
    const [row, setRow] = useState(null);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

        axios.get('admin/mailler')
            .then(({ data }) => {
                setRows(data.data);
            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => {
                setLoading(false);
            });

        return () => {
            setLoading(true);
            setRows([]);
            setError(null);
        }

    }, []);

    return <div style={{ maxWidth: 1100 }}>

        <MaillerEdit
            open={row}
            close={() => setRow(null)}
            setRows={setRows}
        />

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Почтовик"
                subheader="Рассылка заявок по условиям"
                className="flex-grow-1"
            />

            <div>

                <Button
                    icon="plus"
                    color="green"
                    basic
                    circular
                    title="Добавить рассылку"
                    onClick={() => setRow(true)}
                    disabled={loading}
                />

            </div>

        </div>

        {loading && <Loader active inline="centered" />}

        {!loading && rows.length === 0 && !error && <Message info content="Данных еще нет" />}

        {!loading && error && <Message error content={error} />}

        {!loading && rows.length > 0 && rows.map(row => <MaillerRow
            key={row.id}
            row={row}
            setRow={setRow}
        />)}

    </div>
}

export default Mailer;