import React from "react";
import { Grid, Header } from "semantic-ui-react";
import { Pie } from "@antv/g2plot";
import { TinyArea } from "@antv/g2plot";
import moment from "../../../utils/moment";

const RatingInChartsRow = React.memo(props => {

    const { row } = props;

    const requests = [];
    const requests_color = [];

    if (row.requestsAll) {
        requests.push({ type: "Регион", value: row.requestsAll - (row.requests || 0) });
        requests_color.push("#726bf0");
    }
    if (row.requests) {
        requests.push({ type: "Москва", value: row.requests });
        requests_color.push("#3aaf3a");
    }

    const agreements = [];
    if (row.agreements?.firsts) {
        agreements.push({ type: "Первичные", value: row.agreements.firsts });
    }
    if (row.agreements?.seconds) {
        agreements.push({ type: "Вторичные", value: row.agreements.seconds });
    }

    const comings = [];
    const comings_colors = [];

    if (row.comings) {
        comings.push({ type: "Приходы", value: row.comings });
        comings_colors.push("#61a200");
    }
    if (row.drains) {
        comings.push({ type: "Сливы", value: row.drains });
        comings_colors.push("#bd2c2e");
    }

    return <div className="rating-chart-row rating-callcenter-row w-100">

        <Grid>

            <Grid.Row columns="equal">

                <Grid.Column width={8}>

                    <Header content={row.name} subheader={row.pin} />

                    <div className="mb-3">

                        <h5 className="mb-2">КПД за период</h5>

                        <div className="efficiency-bar efficiency-bar-comings bg-light w-100" title="КПД приходов" style={{ height: 20, margin: ".2rem 0", borderRadius: ".3rem", opacity: 1 }}>
                            <div style={{ width: `${row.efficiency || 0}%` }} className="d-flex align-items-center">
                                <small className="text-light px-1">{row.efficiency || 0}%</small>
                            </div>
                        </div>

                        <div className="efficiency-bar efficiency-bar-agreements bg-light w-100" title="КПД договоров" style={{ height: 20, margin: ".2rem 0", borderRadius: ".3rem", opacity: 1 }}>
                            <div style={{ width: `${row.efficiency_agreement || 0}%` }} className="d-flex align-items-center">
                                <small className="text-light px-1">{row.efficiency_agreement || 0}%</small>
                            </div>
                        </div>

                    </div>

                    <div>

                        <h5 className="mb-2" title="По суммарным данным с 01.01.2022">КПД общий*</h5>

                        <div className="efficiency-bar efficiency-bar-comings bg-light w-100" title="КПД приходов" style={{ height: 20, margin: ".2rem 0", borderRadius: ".3rem", opacity: 1 }}>
                            <div style={{ width: `${row.global_stats?.efficiency || 0}%` }} className="d-flex align-items-center">
                                <small className="text-light px-1">{row.global_stats?.efficiency || 0}%</small>
                            </div>
                        </div>

                        <div className="efficiency-bar efficiency-bar-agreements bg-light w-100" title="КПД договоров" style={{ height: 20, margin: ".2rem 0", borderRadius: ".3rem", opacity: 1 }}>
                            <div style={{ width: `${row.global_stats?.efficiency_agreement || 0}%` }} className="d-flex align-items-center">
                                <small className="text-light px-1">{row.global_stats?.efficiency_agreement || 0}%</small>
                            </div>
                        </div>

                    </div>

                </Grid.Column>

                <Grid.Column>
                    <h5 className="text-center">Заявки</h5>
                    <PieChart
                        data={requests}
                        color={requests_color}
                    />
                </Grid.Column>

                <Grid.Column>
                    <h5 className="text-center">Договоры</h5>
                    <PieChart
                        data={agreements}
                    />
                </Grid.Column>

                <Grid.Column>
                    <h5 className="text-center">Приходы</h5>
                    <PieChart
                        data={comings}
                        color={comings_colors}
                    />
                </Grid.Column>

            </Grid.Row>

            <Grid.Row columns="equal">

                <Grid.Column>
                    <div className="substrate-mini-chart">Московские заявки</div>
                    <TinyAreaChart
                        data={row.charts_mini?.requests_moscow || []}
                        color="l(90) 0:#e5fee8 1:#ffffff"
                        lineColor="#3aaf3a"
                    />
                    <PeriadTinyArea start={row.charts_mini?.start} stop={row.charts_mini?.stop} />
                </Grid.Column>

                <Grid.Column>
                    <div className="substrate-mini-chart">Всего заявок</div>
                    <TinyAreaChart
                        data={row.charts_mini?.requests || []}
                    />
                    <PeriadTinyArea start={row.charts_mini?.start} stop={row.charts_mini?.stop} />
                </Grid.Column>

                <Grid.Column>
                    <div className="substrate-mini-chart">Договоры</div>
                    <TinyAreaChart
                        data={row.charts_mini?.agreements_firsts || []}
                        color="l(90) 0:#ffff8a 1:#ffffff"
                        lineColor="#5f5f1a"
                    />
                    <PeriadTinyArea start={row.charts_mini?.start} stop={row.charts_mini?.stop} />
                </Grid.Column>

                <Grid.Column>
                    <div className="substrate-mini-chart">Приходы</div>
                    <TinyAreaChart
                        data={row.charts_mini?.comings || []}
                        color="l(90) 0:#e5fee8 1:#ffffff"
                        lineColor="#61a200"
                    />
                    <PeriadTinyArea start={row.charts_mini?.start} stop={row.charts_mini?.stop} />
                </Grid.Column>

                <Grid.Column>
                    <div className="substrate-mini-chart">Сливы</div>
                    <TinyAreaChart
                        data={row.charts_mini?.drains || []}
                        color="l(90) 0:#ffcfcf 1:#ffffff"
                        lineColor="#9b1818"
                    />
                    <PeriadTinyArea start={row.charts_mini?.start} stop={row.charts_mini?.stop} />
                </Grid.Column>

            </Grid.Row>

        </Grid>

    </div>

});

const PieChart = props => {

    const { data } = props;

    const plot = React.useRef();
    const block = React.useRef();
    const [color, setColor] = React.useState(props.color);
    const changeColor = JSON.stringify(props.color) !== JSON.stringify(color);

    React.useEffect(() => {

        if (plot.current && changeColor) {
            setColor(props.color);
        }

    }, [props.color]);

    React.useEffect(() => {

        if (plot.current) {
            if (color && color.length) {
                plot.current.update({
                    color,
                });
            }
        }

    }, [color]);

    React.useEffect(() => {

        if (!plot.current) {

            plot.current = new Pie(block.current, {
                appendPadding: 5,
                data,
                angleField: 'value',
                colorField: 'type',
                radius: 0.9,
                height: 200,
                label: {
                    type: 'inner',
                    offset: '-30%',
                    content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                    style: {
                        fontSize: 14,
                        textAlign: 'center',
                    },
                },
                legend: false,
                color,
                interactions: [{ type: 'element-active' }],
                animation: {
                    appear: {
                        animation: 'wave-in',
                        duration: 500,
                    },
                }
            });

            plot.current.render();

        } else {
            plot.current && plot.current.changeData(data);
        }

    }, [data]);

    return <div className="position-relative">

        <div ref={block}></div>

        {data.length === 0 && <div
            className="d-flex align-items-center justify-content-center"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.6,
            }}
            children={<small>Данных нет</small>}
        />}

    </div>

}

const TinyAreaChart = props => {

    const { data, color, lineColor } = props;
    const plot = React.useRef();
    const block = React.useRef();

    React.useEffect(() => {

        if (!plot.current) {

            plot.current = new TinyArea(block.current, {
                height: 50,
                autoFit: false,
                data,
                color: color || "l(90) 0:#E5EDFE 1:#ffffff",
                line: {
                    color: lineColor || "#5B8FF9",
                    style: {
                        opacity: 0.8,
                    }
                },
                smooth: true,
                areaStyle: {
                    fillOpacity: 0.3
                }
            });

            plot.current.render();

        } else {
            plot.current && plot.current.changeData(data);
        }

    }, [data]);

    return <div ref={block}></div>;

}

const PeriadTinyArea = ({ start, stop }) => {

    if (!start && !stop)
        return null;

    return <div className="d-flex justify-content-between opacity-50">
        {(start || stop) && <small>{start && moment(start).format("DD MMM")}</small>}
        {stop && <small>{moment(stop).format("DD MMM")}</small>}
    </div>
}

export default RatingInChartsRow;