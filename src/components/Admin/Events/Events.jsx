import React from "react";
import { axios } from "../../../utils";
import AdminContentSegment from "../UI/AdminContentSegment";
import { Header, Icon, Label, Loader, Message } from "semantic-ui-react";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage('javascript', javascript);

const Events = props => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [params, setParams] = React.useState(null);
    const [data, setData] = React.useState({});

    const getEvent = React.useCallback((params = {}) => {

        setLoad(true);

        axios.get('dev/events/get', {
            params: params,
        }).then(({ data }) => {

            setError(null);
            setData(data);

            hljs.initHighlighting();

        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }, []);

    React.useEffect(() => {
        getEvent();
    }, []);

    React.useEffect(() => {
        (typeof params?.id != "undefined" || params?.session) && getEvent(params);
    }, [params]);

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

                {loading && typeof data.id == "undefined" && !error && <Loader active inline />}
            </>}
        />

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <AdminContentSegment
            className="d-flex align-items-center justify-content-between"
            content={<>
                <span className="mx-2">
                    <Icon
                        name="angle left"
                        size="large"
                        fitted
                        link
                        title="Предыдущее событие"
                        onClick={() => setParams({ id: data?.prev })}
                        disabled={load}
                    />
                </span>
                {data?.session && <span className="mx-2">
                    <Icon
                        name="numbered list"
                        size="large"
                        fitted
                        link
                        title="Все события одного запроса"
                        onClick={() => setParams({ session: data.session })}
                        disabled={load}
                    />
                </span>}
                {data?.session && Number(data?.session_count) > 0 && <span>
                    <Label content={data.session_count} size="mini" />
                </span>}
                <div className="flex-grow-1 text-center"><b>{data?.phone || ""}</b></div>
                <span className="mx-2">
                    <Icon
                        name="angle right"
                        size="large"
                        fitted
                        link
                        title="Следующее событие"
                        onClick={() => setParams({ id: data?.next })}
                        disabled={load || data?.next === null}
                    />
                </span>
                <span className="mx-2">
                    <Icon
                        name="angle double right"
                        size="large"
                        fitted
                        link
                        title="Перейти к последнему"
                        onClick={() => setParams({ id: 0 })}
                        disabled={load}
                    />
                </span>
            </>}
        />}

        {typeof data?.rows === "object" && data.rows.map(row => <pre key={row.id} className="mb-2" style={{ opacity: load ? 0.7 : 1 }}>
            <code className="json">{JSON.stringify(row, null, "    ")}</code>
        </pre>)}

    </div>
}

export default Events;