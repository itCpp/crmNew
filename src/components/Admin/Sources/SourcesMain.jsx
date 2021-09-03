import React from "react";
import axios from "./../../../utils/axios-header";

import { Header, Message, Loader, Button } from "semantic-ui-react";

import CreateSource from "./CreateSource";
import Sources from "./Sources";

function SourcesMain() {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [sources, setSources] = React.useState([]);
    const [select, setSelect] = React.useState(null);

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

                    <CreateSource
                        sources={sources}
                        setSources={setSources}
                    />

                </div>
            }

        </div>

        {error
            ? <Message
                error
                header="Ошибка"
                list={[error]}
            />
            : null
        }

        {!loading && !error
            ? <div className="d-flex justify-content-start align-items-start flex-segments">
                <Sources
                    sources={sources}
                    setSources={setSources}
                    select={select}
                    setSelect={setSelect}
                />
            </div>
            : null
        }

    </>

}

export default SourcesMain;