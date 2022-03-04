import React from "react";
import { Dropdown, Header, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import Statistics from "./Statistics";

const SitesStats = props => {

    const searchParams = new URLSearchParams(props.location.search);

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [sites, setSites] = React.useState([]);
    const [site, setSite] = React.useState(searchParams.get('site') || null);

    React.useEffect(() => {

        setLoading(true);

        axios.post('dev/databases/sites').then(({ data }) => {
            setSites(data.sites);
            setSite(data.sites && data.sites[0]?.value);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div>

        {error && <Message
            error
            content={error}
            className="mx-auto" />
        }

        {!error && <Statistics
            site={site}
            loading={load}
            setLoading={setLoad}
            sites={sites}
            site={site}
            setSite={setSite}
        />}

    </div>

}

export default SitesStats;
