import React from "react";
import { Statistic, Popup } from "semantic-ui-react";

const RatingUserRow = props => {

    const { row } = props;
    const className = ['rating-callcenter-row']

    return <div className={className.join(' ')}>

        <div className="d-flex justify-content-between align-items-center header-rating">
            <div>
                <strong>{row.pin}{' '}</strong>
                <span>{row.name}</span>
            </div>
            <b>{row.sector}</b>
        </div>

        <Statistic.Group widths={5} size="mini">

            <Statistic>
                <Statistic.Label>КПД</Statistic.Label>
                <Statistic.Value>
                    <span style={{ opacity: row.kpd > 0 ? 1 : 0.3 }}>{row.kpd}</span>
                </Statistic.Value>
            </Statistic>

            <Statistic>
                <Statistic.Label>Место</Statistic.Label>
                <Statistic.Value>
                    <span>{row.position}</span>
                </Statistic.Value>
            </Statistic>

            <Statistic>
                <Statistic.Label>Заявки</Statistic.Label>
                <Statistic.Value>
                    <Popup
                        content="Всего заявок"
                        trigger={<span style={{ opacity: row.requestsAll > 0 ? 1 : 0.3 }}>{row.requestsAll || 0}</span>}
                        position="top center"
                        size="mini"
                    />
                    {" / "}
                    <Popup
                        content="Московские заявки"
                        trigger={<span style={{ opacity: row.requests > 0 ? 1 : 0.3 }}>{row.requests || 0}</span>}
                        position="top center"
                        size="mini"
                    />
                </Statistic.Value>
            </Statistic>

            <Statistic>
                <Statistic.Label>Приходы</Statistic.Label>
                <Statistic.Value>
                    <span style={{ opacity: row.comings > 0 ? 1 : 0.3 }}>{row.comings}</span>
                </Statistic.Value>
            </Statistic>

            <Statistic>
                <Statistic.Label>Зарплата</Statistic.Label>
                <Statistic.Value>
                    <span style={{ opacity: row.itogo > 0 ? 1 : 0.3 }}>{row.itogo}</span>
                </Statistic.Value>
            </Statistic>

        </Statistic.Group>
    </div>

};

export default RatingUserRow;