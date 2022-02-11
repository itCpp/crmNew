import { Grid, Header } from "semantic-ui-react";
import moment from "moment";

const RequestRowStatisticComing = props => {

    const { data } = props;
    const coming = props.data?.statistic?.coming || null;

    return <Grid.Column>

        <div className="block-card py-3">

            <Header
                as="h4"
                content="Приход"
                subheader={coming?.date && moment(coming.date).format("DD MMMM YYYY")}
                className="mb-1"
                color="green"
            />

            {!coming && <div className="opacity-50 my-3">Приход не найден</div>}

            {coming?.start && <div>Время прихода: <b>{coming.start}</b></div>}
            {coming?.start && <div>Время ухода: {coming?.stop ? <b>{coming.stop}</b> : <i className="text-warning">нет</i>}</div>}

        </div>

    </Grid.Column>

}

export default RequestRowStatisticComing;