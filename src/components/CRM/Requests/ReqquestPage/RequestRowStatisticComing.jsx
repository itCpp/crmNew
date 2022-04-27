import React from "react";
import { Grid, Header, Image, Modal, Icon } from "semantic-ui-react";
import moment from "moment";

const RequestRowStatisticComing = props => {

    const coming = props.data?.statistic?.coming || null;

    const comings = coming?.comings || [];
    const last = comings[comings.length - 1] || null;

    const [showComings, setShowComings] = React.useState(false);

    return <>

        <Grid.Column>

            <div className="block-card py-3">

                <Header
                    as="h3"
                    content="Приход по заявке"
                    className="mb-1"
                    color="green"
                />

                {!coming?.date && <div className="opacity-50 my-3">Приход не найден</div>}

                {coming?.date && <div>{moment(coming.date).format("DD MMMM YYYY")}</div>}
                {coming?.start && <div>Время прихода: <b>{coming.start}</b></div>}
                {coming?.start && <div>Время ухода: {coming?.stop ? <b>{coming.stop}</b> : <i className="text-warning">нет</i>}</div>}

            </div>

        </Grid.Column>

        <Grid.Column>

            <div className="block-card py-3">

                <ComingsModal
                    comings={coming?.comings || []}
                    open={showComings === true}
                    setOpen={setShowComings}
                />

                <div className="d-flex align-items-center mb-1">
                    <Header
                        as="h3"
                        content="Приходы клиента"
                        className="m-0 flex-grow-1"
                        color="green"
                    />
                    {(coming?.comings || []).length > 0 && <span>
                        <Icon
                            name="info circle"
                            fitted
                            link
                            onClick={() => setShowComings(true)}
                        />
                    </span>}
                </div>

                {comings.length === 0 && <div className="opacity-50 my-3">Других приходов нет</div>}

                {comings.length > 0 && <div>

                    <div>Всего приходов <b className="text-success">{comings.length}</b></div>

                    {last !== null && <>
                        <div className="mt-1">Последний приход:</div>
                        <div className="d-flex align-items-center">
                            <Image
                                src={last?.company?.icon}
                                rounded
                                width={16}
                                height={16}
                                title={last?.company?.name || "Неизвестно"}
                                className="mr-2"
                            />
                            <span className="mr-2">{moment(last.date).format("DD.MM.YYYY")}</span>
                            <strong>{last.pin}</strong>
                        </div>
                    </>}

                </div>}

            </div>

        </Grid.Column>

    </>

}

const ComingsModal = ({ open, comings, setOpen }) => <Modal
    open={open}
    header="Все приходы клиента"
    centered={false}
    size="mini"
    closeIcon={true}
    onClose={() => setOpen(false)}
    content={<div className="content px-3 py-2">
        {comings.map((row, i) => <div key={`coming_${i}`} className="d-flex align-items-center px-2 py-1 my-1">
            {row?.company?.icon && <Image
                src={row.company.icon}
                rounded
                width={16}
                height={16}
                title={row.company.name || "Неизвестно"}
                className="mr-2"
            />}
            <span className="mr-2 flex-grow-1 text-nowrap">
                {moment(row.date).format("DD.MM.YYYY")}
                {row.time && <span className="ml-2 opacity-60">{row.time}</span>}
            </span>
            {row.pin && <strong>{row.pin}</strong>}
        </div>)}
    </div>}
/>

export default RequestRowStatisticComing;