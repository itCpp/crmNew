import React from "react";
import { axios } from "../../../../utils";
import { Grid, Header, Loader, Message } from "semantic-ui-react";
import SiteRow from "./SiteRow";

const checkSite = async id => {

    let response = {
        error: "Нет подключения",
    };

    await axios.post('dev/resource/site', { id })
        .then(({ data }) => {
            response = data?.site?.check || {
                error: "Проверка не удалась",
            };
        })
        .catch(e => {
            response = {
                error: axios.getError(e),
            };
        });

    return response;
}

const checkAll = async (rows, setRows, setForCheck) => {

    let checked = [];

    for (let i in rows) {

        let row = rows[i];

        if (checked.indexOf(row.name) < 0) {

            let check = await checkSite(row.id);

            setRows(prev => {

                let rows = [...prev];

                rows.forEach((item, key) => {
                    if (item.name === row.name || item.id === row.id) {
                        rows[key] = { ...item, check }
                    }
                });
                return rows;
            });

            checked.push(row.name);
        }
    }

    setForCheck(true);
}

const Sites = () => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [forCheck, setForCheck] = React.useState(false);

    React.useEffect(() => {

        setLoading(true);

        axios.get('dev/resource/sites')
            .then(({ data }) => {
                setRows(data.sites);
                checkAll(data.sites, setRows, setForCheck);
            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => {
                setLoading(false);
            });

    }, []);

    return <div style={{ maxWidth: 1000 }}>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Проверка сайтов"
                subheader="Проверяет доступность сайтов"
                className="flex-grow-1"
            />

            {loading && <Loader active inline />}

        </div>

        {!loading && error && <Message error content={error} />}
        {!loading && !error && rows.length === 0 && <Message
            content="Создайте ресурс для источника"
        />}

        <Grid columns={2}>
            {!loading && rows.length > 0 && rows.map(row => <SiteRow
                key={row.id}
                row={row}
                setRows={setRows}
                forCheck={forCheck}
            />)}
        </Grid>

    </div>
}

export default Sites;