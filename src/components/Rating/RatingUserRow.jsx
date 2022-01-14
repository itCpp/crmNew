import React from "react";
import { Header, Grid, Icon, Popup } from "semantic-ui-react";
import moment from "moment";

const RatingUserRow = props => {

    const [show, setShow] = React.useState(false);

    const { row } = props;
    const className = ['rating-callcenter-row'];

    if (row.color)
        className.push(`rating-row-color-${row.color}`);

    return <div className={className.join(' ')}>

        <div className="d-flex justify-content-between align-items-center mb-4">
            <Header
                as="h4"
                className="m-0"
                content={row.name}
                subheader={<div className="sub header">
                    <span>{row.pin}</span>
                    {row.pinOld && <span className="opacity-70 ml-2">({row.pinOld})</span>}
                    {row.sector && <b className="ml-2">{row.sector.name}</b>}
                </div>}
            />
            {row.salary > 0 && <Header as="h1" className="m-0 opacity-80" content={row.salary} />}
        </div>

        <Grid columns="equal" className="position-relative">

            <Grid.Row>

                <Grid.Column>
                    <div className="rating-info-rows">
                        <div>
                            <span>Заявки</span>
                            <span>
                                <Popup
                                    content="Всего заявок"
                                    trigger={<b style={{ opacity: row.requestsAll > 0 ? 1 : 0.3 }}>{row.requestsAll || 0}</b>}
                                    position="top center"
                                    size="mini"
                                />
                                {" / "}
                                <Popup
                                    content="Московские заявки"
                                    trigger={<b style={{ opacity: row.requests > 0 ? 1 : 0.3 }}>{row.requests || 0}</b>}
                                    position="top center"
                                    size="mini"
                                />
                            </span>
                        </div>
                        <div>
                            <span>Приходы</span>
                            <b>{row.comings}</b>
                        </div>
                        <div>
                            <span>Приходов в день</span>
                            <b>{row.comings_in_day}</b>
                        </div>
                        <div>
                            <span>За приход</span>
                            <span><b>{row.coming_one_pay}</b> руб</span>
                        </div>
                    </div>
                </Grid.Column>

                <Grid.Column>
                    <div className="rating-info-rows">
                        <div>
                            <span>КПД</span>
                            <span><b>{row.efficiency.toFixed(2)}</b>%</span>
                        </div>
                        <div>
                            <span>Нагрузка</span>
                            <span><b>{row.load}</b> руб</span>
                        </div>
                        <div>
                            <span>Место</span>
                            <b>{row.place}</b>
                        </div>
                    </div>
                </Grid.Column>

                <Grid.Column>
                    <div className="rating-info-rows">
                        <div>
                            <span>Приходы</span>
                            <span><b>{row.comings_sum}</b> руб</span>
                        </div>
                        <div>
                            <span>Бонус приходов</span>
                            <span><b>{row.bonus_comings}</b> руб</span>
                        </div>
                        <div>
                            <span>Касса</span>
                            <span><b>{row.cahsbox}</b> руб</span>
                        </div>
                        <div>
                            <span>Бонус кассы</span>
                            <span><b>{row.bonus_cahsbox}</b> руб</span>
                        </div>
                        <div>
                            <span>Бонус ОКК</span>
                            <span><b>0</b> руб</span>
                        </div>
                    </div>
                </Grid.Column>

                {row.admin && <Grid.Column>
                    <div className="rating-info-rows">
                        <div><b>Сектор{row.sector && ` ${row.sector.name}`}</b></div>
                        <div>
                            <span>Заявки</span>
                            <span><b>{row.admin.requestsAll || 0}</b></span>
                        </div>
                        <div>
                            <span>Москва</span>
                            <span><b>{row.admin.requests || 0}</b></span>
                        </div>
                        <div>
                            <span>Приходы</span>
                            <span><b>{row.admin.comings || 0}</b></span>
                        </div>
                        <div>
                            <span>КПД</span>
                            <span><b>{(row.admin.efficiency || 0).toFixed(2)}</b>%</span>
                        </div>
                        <div>
                            <span>За приход</span>
                            <span><b>{row.admin_coming_one_pay || 0}</b> руб</span>
                        </div>
                    </div>
                </Grid.Column>}

                {row.chief && <Grid.Column>
                    <div className="rating-info-rows">
                        <div><b>Колл-центр</b></div>
                        <div>
                            <span>Заявки</span>
                            <span><b>{row.chief.requestsAll || 0}</b></span>
                        </div>
                        <div>
                            <span>Москва</span>
                            <span><b>{row.chief.requests || 0}</b></span>
                        </div>
                        <div>
                            <span>Приходы</span>
                            <span><b>{row.chief.comings || 0}</b></span>
                        </div>
                        <div>
                            <span>КПД</span>
                            <span><b>{(row.chief.efficiency || 0).toFixed(2)}</b>%</span>
                        </div>
                        <div>
                            <span>За приход</span>
                            <span><b>{row.chief_coming_one_pay || 0}</b> руб</span>
                        </div>
                    </div>
                </Grid.Column>}

                <Grid.Column>
                    <div className="rating-info-rows">
                        <div><b>Начислено</b></div>
                        <div>
                            <span>Бонусы</span>
                            <Popup
                                content="Бонусы начисляются по усмотрению руководства"
                                trigger={<span>
                                    <b>{row.bonuses || 0}</b> руб<b className="text-danger">*</b>
                                </span>}
                                position="top center"
                                size="mini"
                            />
                        </div>
                        {typeof row.admin_bonus != "undefined" && <div>
                            <span>Премия</span>
                            <span><b>{row.admin_bonus || 0}</b> руб</span>
                        </div>}
                        {typeof row.chief_bonus != "undefined" && <div>
                            <span>Премия</span>
                            <span><b>{row.chief_bonus || 0}</b> руб</span>
                        </div>}
                        <div>
                            <span>К выдаче</span>
                            <span><b>{row.salary || 0}</b> руб</span>
                        </div>
                    </div>
                </Grid.Column>

            </Grid.Row>

            {row.dates && row.dates.length > 0 && <div className={show ? `rating-show-dates showing` : `rating-show-dates`} title="Посмотреть подробные данные за отдельный день">
                <Icon name="chevron down" fitted onClick={() => setShow(show => !show)} />
            </div>}

        </Grid>

        {show && <Grid
            className="mt-3 mb-2 px-3 rating-dates"
            columns="equal"
            divided="vertically"
            textAlign="center"
        >

            <Grid.Row>
                <Grid.Column><strong>Дата</strong></Grid.Column>
                <Grid.Column><strong>Заявки</strong></Grid.Column>
                <Grid.Column><strong>Москва</strong></Grid.Column>
                <Grid.Column><strong>Приходы</strong></Grid.Column>
                <Grid.Column><strong>Бонус приходов</strong></Grid.Column>
                <Grid.Column><strong>Касса</strong></Grid.Column>
            </Grid.Row>

            {row.dates.map(day => <Grid.Row key={`${row.pin}-${day.timestamp}`}>
                <Grid.Column><strong>{moment(day.date).format("DD.MM.YYYY")}</strong></Grid.Column>
                <Grid.Column>{day.requestsAll}</Grid.Column>
                <Grid.Column>{day.requests}</Grid.Column>
                <Grid.Column>{day.comings}</Grid.Column>
                <Grid.Column>{day.bonus_comings}</Grid.Column>
                <Grid.Column>{day.cahsbox}</Grid.Column>
            </Grid.Row>)}

        </Grid>}

    </div>

};

export default RatingUserRow;