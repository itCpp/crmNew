import React from "react";
import { Grid, Header, Image, Modal, Icon } from "semantic-ui-react";
import moment from "moment";

const RequestRowStatisticAgreement = props => {

    const agreements = props.data?.statistic?.agreements || [];
    const last = agreements[agreements.length - 1] || null;

    const [open, setOpen] = React.useState(false);

    return <>

        <Grid.Column>

            <div className="block-card py-3">

                <Modal
                    open={open}
                    header="Все договоры клиента"
                    centered={false}
                    size="mini"
                    closeIcon={true}
                    onClose={() => setOpen(false)}
                    content={<div className="content px-3 py-2">
                        {agreements.map((row, i) => <div key={`coming_${i}`} className="d-flex align-items-center px-2 py-1 my-1">
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
                            {row.nomerDogovora && <strong>№{row.nomerDogovora}</strong>}
                        </div>)}
                    </div>}
                />

                <div className="d-flex align-items-center mb-1">
                    <Header
                        as="h3"
                        content="Договоры"
                        className="mb-0 flex-grow-1"
                        color="orange"
                    />
                    {agreements.length > 0 && <span>
                        <Icon
                            name="info circle"
                            fitted
                            link
                            onClick={() => setOpen(true)}
                        />
                    </span>}
                </div>

                {agreements.length === 0 && <div className="opacity-50 my-3">Договоров нет</div>}

                {agreements.length > 0 && <>
                    <div>Заключено договоров <b className="text-success">{agreements.length}</b></div>

                    {last !== null && <>
                        <div className="mt-1">Последний договор:</div>
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
                            <strong>№{last.nomerDogovora}</strong>
                        </div>
                    </>}
                </>}

            </div>

        </Grid.Column>

    </>

}

export default RequestRowStatisticAgreement;