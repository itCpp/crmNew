import React from "react";
import { Button, Grid, Header, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import MailListEdit from "./MailListEdit";
import MailListRow from "./MailListRow";
import "./maillist.css";

const MailList = props => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(false);

    const [row, setRow] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    const getRows = React.useCallback((params = {}) => {

        setLoad(true);

        axios.post('admin/mails/get', params).then(({ data }) => {
            setRows(p => Number(data.page) > 1 ? [...p, ...data.rows] : data.rows)
        }).catch(e => {

        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }, []);

    React.useEffect(() => {

        getRows();

        window.Echo && window.Echo.private('App.Admin')
            .listen('Users\\MailListAdminEvent', data => {
                setRows(p => {
                    const rows = [...p];
                    rows.forEach((row, i) => {
                        if (row.id === data.id)
                            rows[i] = data;
                    });
                    return rows;
                });
            });
        
        return () => {
            window.Echo && window.Echo.private('App.Admin')
                .stopListening('Users\\MailListAdminEvent');
        }

    }, []);

    return <div className="segment-compact">

        <MailListEdit
            open={row}
            close={() => setRow(null)}
            setRows={setRows}
        />

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Рассылка"
                subheader="Рассылка внутренних уведомлений"
                className="flex-grow-1"
            />

            <div>

                <Button
                    icon="plus"
                    color="green"
                    basic
                    circular
                    title="Создать рассылку"
                    onClick={() => setRow(true)}
                    disabled={loading}
                />

            </div>

        </div>

        {loading && <Loader active inline="centered" />}

        {!loading && rows.length === 0 && <div className="admin-content-segment">
            <strong>Данных еще нет</strong>
        </div>}

        {!loading && rows.length > 0 && <Grid columns={3}>
            {rows.map(row => <Grid.Column key={row.id}>
                <MailListRow row={row} />
            </Grid.Column>)}
        </Grid>}

    </div>
}

export default MailList;