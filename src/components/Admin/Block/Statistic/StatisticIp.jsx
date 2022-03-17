import React from "react";
import axios from "./../../../../utils/axios-header";
import { Header, Loader, Message, Button, Grid, Statistic, Table } from "semantic-ui-react";

import { setBlockIp } from "./../Block";
import FlagIp from "./IP/FlagIp";
import IpSitesCountGraph from "./IP/IpSitesCountGraph";
import moment from "moment";

export default (props => {

    const searchParams = new URLSearchParams(props?.location?.search || "");
    const addr = searchParams.get('addr');

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState({});
    const [loadBlock, setLoadBlock] = React.useState(false);

    const blockIp = async ip => {
        setLoadBlock(true);

        await setBlockIp(
            { ip: ip },
            data => {
                if (data?.row?.block === 1) {
                    axios.toast(`IP заблокирован`, {
                        title: ip,
                        type: "warning",
                        icon: "ban",
                    });
                }
                else if (data?.row?.block === 0) {
                    axios.toast(`IP удален из блокировок`, {
                        title: ip,
                        type: "warning",
                        icon: "check",
                    });
                }

                setData(prev => ({ ...prev, block: data.row }));
            },
            e => axios.toast(e)
        );

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
                        icon={data?.block?.block === 1 ? "minus circle" : "ban"}
                        title={data?.block?.block === 1 ? "Снять блокировку" : "Заблокировать"}
                        basic
                        color={data?.block?.block === 1 ? "red" : "green"}
                        disabled={loadBlock}
                        onClick={() => blockIp(addr)}
                        loading={loadBlock}
                    />
                </div>
            }

        </div>

        {!loading && error && <div className="segment-compact">
            <Message error content={error} />
        </div>}

        {!loading && !error && <div>

            <div className="admin-content-segment">

                <Header as="h3" content="Общая статистика посещений" className="mb-4" subheader="Данные по всем сайтам за все время" />

                <div className="opacity-70 d-flex justify-content-center mx-4">

                    <Statistic className="mx-4">
                        <Statistic.Value>{data.generalStats?.visits || 0}</Statistic.Value>
                        <Statistic.Label>Просмотры<br />сегодня</Statistic.Label>
                    </Statistic>

                    <Statistic className="mx-4">
                        <Statistic.Value>{data.generalStats?.visitsAll || 0}</Statistic.Value>
                        <Statistic.Label>Всего<br />просмотров</Statistic.Label>
                    </Statistic>

                    <Statistic className="mx-4">
                        <Statistic.Value>{data.generalStats?.visitsBlock || 0}</Statistic.Value>
                        <Statistic.Label>Блокировнные<br />входы</Statistic.Label>
                    </Statistic>

                    <Statistic className="mx-4">
                        <Statistic.Value>{data.generalStats?.visitsBlockAll || 0}</Statistic.Value>
                        <Statistic.Label>Блокировнных<br />входов всего</Statistic.Label>
                    </Statistic>

                    <Statistic className="mx-4">
                        <Statistic.Value>{data.generalStats?.requests || 0}</Statistic.Value>
                        <Statistic.Label>Заявки<br />сегодня</Statistic.Label>
                    </Statistic>

                    <Statistic className="mx-4">
                        <Statistic.Value>{data.generalStats?.requestsAll || 0}</Statistic.Value>
                        <Statistic.Label>Всего<br />заявок</Statistic.Label>
                    </Statistic>

                    <Statistic className="mx-4">
                        <Statistic.Value>{data.generalStats?.queues || 0}</Statistic.Value>
                        <Statistic.Label>Очередь<br />сегодня</Statistic.Label>
                    </Statistic>

                    <Statistic className="mx-4">
                        <Statistic.Value>{data.generalStats?.queuesAll || 0}</Statistic.Value>
                        <Statistic.Label>Всего заявок<br />в очереди</Statistic.Label>
                    </Statistic>

                </div>

            </div>

            <div className="admin-content-segment">

                <Header as="h3" content="Посещения на сайтах" className="mb-5" subheader="Статистика посещений по каждому сайту" />

                {typeof data.sitesStats == "object" && <div className="pb-2">

                    {data.sitesStats.length === 0 && <div className="text-center my-5 opacity-50">Данных нет</div>}

                    {data.sitesStats.length > 0 && <Table basic="very" compact>

                        <Table.Header>
                            <Table.Row textAlign="center">
                                <Table.HeaderCell textAlign="left">Сайт</Table.HeaderCell>
                                <Table.HeaderCell>Просмотры сегодня</Table.HeaderCell>
                                <Table.HeaderCell>Всего просмотров</Table.HeaderCell>
                                <Table.HeaderCell>Блокированные входы</Table.HeaderCell>
                                <Table.HeaderCell>Заявки сегодня</Table.HeaderCell>
                                <Table.HeaderCell>Заявок всего</Table.HeaderCell>
                                <Table.HeaderCell>Очередь сегодня</Table.HeaderCell>
                                <Table.HeaderCell>Всего заявок в очереди</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {data.sitesStats.map((row, i) => <Table.Row key={i} textAlign="center">
                                <Table.Cell textAlign="left">
                                    {typeof row.domains == "object"
                                        ? row.domains.map(domain => <div key={domain}>
                                            <a href={`//${domain}`} target="_blank">{domain}</a>
                                        </div>)
                                        : (row.domain || "Сссылка не определена")
                                    }
                                </Table.Cell>
                                <Table.Cell>{row.visits}</Table.Cell>
                                <Table.Cell>{row.visitsAll}</Table.Cell>
                                <Table.Cell>{row.visitsBlock}</Table.Cell>
                                <Table.Cell>{row.requests}</Table.Cell>
                                <Table.Cell>{row.requestsAll}</Table.Cell>
                                <Table.Cell>{row.queues}</Table.Cell>
                                <Table.Cell>{row.queuesAll}</Table.Cell>
                            </Table.Row>)}
                        </Table.Body>

                    </Table>}

                </div>}

            </div>

            <Grid>
                {/* {data?.stats?.chart && data.stats.chart.map((chart, key) => <Grid.Row key={key}>
                    <Grid.Column>
                        <div className="admin-content-segment">
                            <Header content={chart.name} as="h3" />
                            <IpSitesCountGraph data={chart.data || []} />
                        </div>
                    </Grid.Column>
                </Grid.Row>)} */}

                {typeof data.textInfo == "object" && data.textInfo.length > 0 && <Grid.Row columns="equal">
                    {/* <Grid.Column> */}
                    {data.textInfo.map((row, key) => <Grid.Column key={key}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h3 className="my-0 mx-3">{row.name}</h3>
                            {row.datetime && <div>
                                <small>Обновлено: {moment(row.datetime).format("DD.MM.YYYY HH:mm")}</small>
                            </div>}
                        </div>
                        <pre className="pre border">{row.data}</pre>
                    </Grid.Column>)}
                    {/* </Grid.Column> */}
                </Grid.Row>}

            </Grid>

        </div>}

    </div>

});