import { Grid, Header, Image } from "semantic-ui-react";
import moment from "moment";

const RequestRowStatisticComing = props => {

    const coming = props.data?.statistic?.coming || null;

    const comings = coming?.comings || [];
    const last = comings[comings.length - 1] || null;

    return <>

        <Grid.Column>

            <div className="block-card py-3">

                <Header
                    as="h3"
                    content="Приход"
                    className="mb-1"
                    color="green"
                />

                {!coming && <div className="opacity-50 my-3">Приход не найден</div>}

                {coming?.date && <div>{moment(coming.date).format("DD MMMM YYYY")}</div>}
                {coming?.start && <div>Время прихода: <b>{coming.start}</b></div>}
                {coming?.start && <div>Время ухода: {coming?.stop ? <b>{coming.stop}</b> : <i className="text-warning">нет</i>}</div>}

            </div>

        </Grid.Column>

        <Grid.Column>

            <div className="block-card py-3">

                <Header
                    as="h3"
                    content="Приходы клиента"
                    className="mb-1"
                    color="green"
                />

                {comings.length === 0 && <div className="opacity-50 my-3">Других приходов нет</div>}

                {comings.length > 0 && <div>

                    <div>Всего приходов <b>{comings.length}</b></div>

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

export default RequestRowStatisticComing;