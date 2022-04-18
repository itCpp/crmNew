import React from "react";
import { axios } from "../../../utils";
import AdminContentSegment from "../UI/AdminContentSegment";
import { Header, Loader, Message } from "semantic-ui-react";

const Events = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [id, setId] = React.useState(null);
    const [event, setEvent] = React.useState(null);

    const getEvent = React.useCallback(id => {

        axios.get('dev/events/get', {
            params: { id },
        }).then(({ data }) => {
            setError(null);
        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {
        getEvent(id);
    }, []);

    return <div className="segment-compact">

        <AdminContentSegment
            className="d-flex align-items-center"
            content={<>
                <Header
                    as="h2"
                    content="События"
                    subheader="Просмотр обращений, поступивших на сервер приёма"
                    className="flex-grow-1"
                />

                {loading && id === null && <Loader active inline />}
            </>}
        />

        {!loading && error && <Message error content={error} />}

    </div>
}

export default Events;