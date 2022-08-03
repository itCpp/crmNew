import React from "react";
import { Button, Dimmer, Loader, Modal } from "semantic-ui-react";
import { axios } from "../../../../utils";

const ExceptionHostsList = props => {

    const { site } = props;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        if (loading) {
            axios.post('dev/block/exceptionshostsite', { site })
                .then(({ data }) => {

                })
                .catch(e => {
                    setError(axios.getError(e));
                })
                .then(() => {
                    setLoading(false);
                });
        }

    }, [loading]);

    return <Modal
        trigger={<Button
            basic
            icon="list"
            circular
            title="Список исключений хостов"
            disabled={Boolean(props.disabled)}
            onClick={() => setLoading(true)}
        />}
        closeIcon
        header="Исключения хостов"
        centered={false}
        size="small"
        content={<div className="content position-relative">

            {!loading && error && <div className="text-danger">
                <b>{error}</b>
            </div>}

            {loading && <div className="my-5">
                <Dimmer active inverted>
                    <Loader active inline="centered" />
                </Dimmer>
            </div>}

        </div>}
    />

}

export default ExceptionHostsList;