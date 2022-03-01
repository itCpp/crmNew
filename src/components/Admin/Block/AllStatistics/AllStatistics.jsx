import { useEffect, useState } from "react";
import { Header, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";

const AllStatistic = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        axios.post("dev/block/allstatistics").then(({ data }) => {

            setError(null);

        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div>

        <AdminContentSegment className="d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Общая статистика"
                subheader="Статистика посещений по всем подключенным сайтам"
            />

            {loading && <Loader inline active />}

        </AdminContentSegment>

        {error && !loading && <Message content={error} error />}

    </div>
}

export default AllStatistic;