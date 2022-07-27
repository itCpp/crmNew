import React from "react";
import { Message } from "semantic-ui-react";
import { axios } from "../../../../utils";
import Statistics from "./Statistics";

const SitesStats = props => {

    const searchParams = new URLSearchParams(props.location.search);

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [sites, setSites] = React.useState([]);
    const [site, setSite] = React.useState(Number(searchParams.get('site')));

    React.useEffect(() => {

        setLoading(true);

        axios.post('dev/databases/sites').then(({ data }) => {
            setSites(data.sites);
            site === 0 && setSite(data.sites && data.sites[0]?.value);
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
            loading={load}
            setLoading={setLoad}
            sites={sites}
            site={site}
            setSite={setSite}
        />}

    </div>

}

export default SitesStats;
