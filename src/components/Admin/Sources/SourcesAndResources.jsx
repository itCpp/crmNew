import React from "react";
import { withRouter } from "react-router";

import { Header, Message, Loader, Button } from "semantic-ui-react";

import CreateSource from "./CreateSource";
import Sources from "./Sources";

import CreateResource from "./CreateResource";
import Resources from "./Resources";

function SourcesAndResources(props) {

    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(props.match?.params?.type || "sources");

    const [sources, setSources] = React.useState([]);
    const [resources, setResources] = React.useState([]);

    React.useEffect(() => {

        if (page === "resources") {
            setPage("resources");
            if (props.match.url !== "/admin/sources/resources")
                props.history.push('/admin/sources/resources');
        }
        else {
            setPage("sources");
            if (props.match.url !== "/admin/sources")
                props.history.push('/admin/sources');
        }

    }, [page]);

    return <>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Источники и ресурсы"
                subheader="Настройка ресурсов с источниками и связи между ними"
            />

            {loading
                ? <Loader active inline />
                : <div>

                    <Button
                        icon="list"
                        basic={page === "resources" ? false : true}
                        color="blue"
                        title="Список ресурсов для источников"
                        size="mini"
                        circular
                        onClick={() => setPage(page !== "resources" ? "resources" : "sources")}
                    />

                    {page === "sources"
                        ? <CreateSource
                            sources={sources}
                            setSources={setSources}
                        />
                        : null
                    }

                    {page === "resources"
                        ? <CreateResource
                            resources={resources}
                            setResources={setResources}
                        />
                        : null
                    }

                </div>
            }

        </div>

        {page === "sources"
            ? <Sources
                loading={loading}
                setLoading={setLoading}
                sources={sources}
                setSources={setSources}
            />
            : null
        }

        {page === "resources"
            ? <Resources
                loading={loading}
                setLoading={setLoading}
                resources={resources}
                setResources={setResources}
            />
            : null
        }

    </>

}

export default withRouter(SourcesAndResources);
