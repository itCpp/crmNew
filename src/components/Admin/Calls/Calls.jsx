import React from "react";
import axios from "./../../../utils/axios-header";
import { Button, Header, Loader, Message } from "semantic-ui-react";

import CallsList from "./CallsList";
import Extensions from "./Extensions";
import ExtensionModal from "./ExtensionModal";

const Calls = props => {

    const { permits } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [calls, setCalls] = React.useState([]);

    const [showExtensions, setShowExtensions] = React.useState(false);

    // Модальное окно редактирования и создания
    const [extension, setExtension] = React.useState(null);
    const [sip, setSip] = React.useState(null);
    const [extensions, setExtensions] = React.useState([]);

    const incomingCall = call => {
        setCalls(prevCalls => [call, ...prevCalls].slice(0, -1));
    }

    React.useEffect(() => {

        axios.post('dev/getCalls').then(({ data }) => {
            setCalls(data.calls);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

        if (permits.dev_calls)
            window.Echo.private(`App.Admin.Calls`)
                .listen('IncomingCalls', ({ data }) => incomingCall(data));

        return () => {
            if (permits.dev_calls)
                window.Echo.leave(`App.Admin.Calls`);
        }

    }, []);

    return <>

        {extension &&
            <ExtensionModal
                setOpen={setExtension}
                id={extension}
                setExtensions={setExtensions}
                sip={sip}
                setSip={setSip}
                setCalls={setCalls}
            />
        }

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Звонки"
                subheader="Журнал вызовов и настройка sip-источников"
            />

            {loading
                ? <Loader active inline />
                : <div>
                    <Button
                        circular
                        icon="tty"
                        basic={!showExtensions}
                        primary
                        onClick={() => setShowExtensions(prev => !prev)}
                    />
                </div>
            }

        </div>

        {!loading &&
            <div className="d-flex justify-content-start align-items-start flex-segments">

                {showExtensions
                    ? <Extensions
                        extension={extension}
                        setExtension={setExtension}
                        extensions={extensions}
                        setExtensions={setExtensions}
                    />
                    : <div className="admin-content-segment position-relative">

                        <div className="divider-header">
                            <h3>Журнал звонков</h3>
                        </div>

                        {error
                            ? <Message error content={error} />
                            : <CallsList
                                calls={calls}
                                setSip={setSip}
                                setExtension={setExtension}
                            />
                        }

                    </div>
                }

            </div>
        }

    </>

}

export default Calls;