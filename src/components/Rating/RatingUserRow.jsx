import React from "react";
import { Header, Grid, Statistic, Popup } from "semantic-ui-react";

const RatingUserRow = props => {

    const { row } = props;
    const className = ['rating-callcenter-row'];

    if (row.color)
        className.push(`rating-row-color-${row.color}`);

    return <div className={className.join(' ')}>

        <Header
            as="h4"
            content={row.name}
            subheader={<div className="sub header">
                <span>{row.pin}</span>
                {row.pinOld && <span className="opacity-70 ml-2">({row.pinOld})</span>}
                {row.sector && <b className="ml-2">{row.sector.name}</b>}
            </div>}
        />

        <Grid columns="equal">

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
                    </div>
                </Grid.Column>

                <Grid.Column>
                    <div className="rating-info-rows">
                        <div>
                            <span>КПД</span>
                            <span><b>{row.efficiency.toFixed(2)}</b>%</span>
                        </div>
                        <div>
                            <span>Плата за приход</span>
                            <span><b>{row.coming_one_pay}</b> руб</span>
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
                            <span>Бонус за приходы</span>
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

                <Grid.Column>
                    <div className="rating-info-rows">
                        <div><b>Начислено</b></div>
                        <div>
                            <span>Бонусы</span>
                            <Popup
                                content="Бонусы начисляются по усмотрению руководства"
                                trigger={<span>
                                    <b>{row.bonuses || 0}<span className="text-danger">*</span></b> руб
                                </span>}
                                position="top center"
                                size="mini"
                            />
                        </div>
                        <div>
                            <span>К выдаче</span>
                            <span><b>{row.result || 0}</b> руб</span>
                        </div>
                    </div>
                </Grid.Column>

            </Grid.Row>

        </Grid>

    </div>

};

export default RatingUserRow;