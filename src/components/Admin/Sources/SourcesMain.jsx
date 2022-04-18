import React from "react";
import { withRouter } from "react-router";
import axios from "./../../../utils/axios-header";

import { Header, Message, Loader, Button } from "semantic-ui-react";

import CreateSource from "./CreateSource";
import Sources from "./Sources";

function SourcesMain(props) {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [sources, setSources] = React.useState([]);
    const [select, setSelect] = React.useState(null);

    const [showResource, setShowResource] = React.useState(props.match?.params?.type || null);
    const [resources, setResources] = React.useState([]);

    React.useEffect(() => {

        axios.post('dev/getSources').then(({ data }) => {
            setSources(data.sources);
            setError(null);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const getResources = () => {

        setShowResource(true);

    }

    return <>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Источники и ресурсы"
                subheader="Настройка ресурсов с источниками и связи между ними"
            />

            {loading && <Loader active inline />}

            {!loading && <div>

                <Button
                    icon="list"
                    basic={showResource ? false : true}
                    color="blue"
                    title="Список ресурсов для источников"
                    size="mini"
                    circular
                    onClick={getResources}
                />

                <CreateSource
                    sources={sources}
                    setSources={setSources}
                />

            </div>}

        </div>

        {error && <Message
            error
            header="Ошибка"
            list={[error]}
        />}

        {!loading && !error && <div className="d-flex justify-content-start align-items-start flex-segments">
            <Sources
                sources={sources}
                setSources={setSources}
                select={select}
                setSelect={setSelect}
            />
        </div>}

    </>

}

export default withRouter(SourcesMain);