import { Grid, Header, Image } from "semantic-ui-react";
import moment from "moment";

const RequestRowStatisticAgreement = props => {

    const agreements = props.data?.statistic?.agreements || [];
    const last = agreements[agreements.length - 1] || null;

    return <>

        <Grid.Column>

            <div className="block-card py-3">

                <Header
                    as="h3"
                    content="Договоры"
                    className="mb-1"
                    color="orange"
                />

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