import React from "react";
import axios from "./../../../../utils/axios-header";
import { Header, Loader, Message, Button } from "semantic-ui-react";
import FlagIp from "./IP/FlagIp";
import { setBlockIp } from "./../Block";

export default (props => {

    const searchParams = new URLSearchParams(props?.location?.search || "");
    const addr = searchParams.get('addr');

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState({});
    const [loadBlock, setLoadBlock] = React.useState(false);

    const blockIp = async ip => {
        setLoadBlock(true);

        await setBlockIp({ ips: ip }, console.log, console.log);

        setLoadBlock(false);
    }

    React.useEffect(() => {

        axios.post('dev/block/ipInfo', { ip: addr }).then(({ data }) => {
            setData(data);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    let region = [];

    if (data?.ipinfo?.region_name)
        region.push(data?.ipinfo?.region_name);
    if (data?.ipinfo?.city)
        region.push(data?.ipinfo?.city);

    return <div>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header as="h2">
                Статистика IP-адреса
                <Header.Subheader>
                    <span>{addr}</span>
                    {data?.ipinfo?.country_code && <FlagIp name={data.ipinfo.country_code.toLowerCase()} className="ml-2 mr-0" />}
                    {region.length > 0 && <span className="ml-2">{region.join(", ")}</span>}
                </Header.Subheader>
            </Header>

            {loading
                ? <Loader active inline />
                : <div>
                    <Button
                        circular
                        icon="ban"
                        basic
                        color="red"
                        disabled
                        onClick={() => blockIp(addr)}
                        loading={loadBlock}
                    />
                </div>
            }

        </div>

        {!loading && error && <div className="segment-compact">
            <Message error content={error} />
        </div>}

    </div>

});