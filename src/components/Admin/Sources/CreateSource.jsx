import React from "react";
import axios from "./../../../utils/axios-header";

import { Button } from "semantic-ui-react";

const CreateSource = props => {

    const { sources, setSources } = props;
    const [create, setCreate] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        if (create) {

            axios.post('dev/createSource').then(({ data }) => {
                setSources([data.source, ...sources]);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setCreate(false);
            });

        }

    }, [create]);

    return <Button
        icon="plus"
        basic
        positive={!error ? true : false}
        negative={error ? true : false}
        title="Создать новый источник"
        circular
        loading={create}
        disabled={create}
        onClick={() => setCreate(true)}
    />

}

export default CreateSource;