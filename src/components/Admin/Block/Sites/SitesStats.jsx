import React from "react";
import { Dropdown, Header, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import SitesStatisticTable from "./SitesStatisticTable";

const SitesStats = props => {

    const searchParams = new URLSearchParams(props.location.search);

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [sites, setSites] = React.useState([]);
    const [site, setSite] = React.useState(searchParams.get('site') || null);

    React.useEffect(() => {

        setLoading(true);

        axios.post('dev/block/sites').then(({ data }) => {
            setSites(data);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    if (loading) {
        return <Loader inline="centered" active />
    }

    if (error) {
        return <Message error content={error} style={{ maxWidth: 600 }} className="mx-auto" />
    }

    return <div>

        <AdminContentSegment className="d-flex justify-content-between align-items-center">

            <Header
                content="Статистика по сайтам"
                subheader={"Выберите сайт в правом меню"}
            />

            <Dropdown
                selection
                placeholder="Выберите сайт"
                options={sites.map(site => ({
                    key: site,
                    text: site,
                    value: site
                }))}
                value={site}
                onChange={(e, { value }) => setSite(value)}
                disabled={load}
            />

        </AdminContentSegment>

        <SitesStatisticTable
            site={site}
            loading={load}
            setLoading={setLoad}
        />

    </div>

}

export default SitesStats;
