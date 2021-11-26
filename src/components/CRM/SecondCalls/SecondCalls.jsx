import React from "react";
import axios from "./../../../utils/axios-header";
import moment from "./../../../utils/moment";
import { Link } from "react-router-dom";

import { Message, Loader, Comment, Icon, Label } from "semantic-ui-react";

import "./secondcalls.css";

const SecondCalls = () => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [secondCalls, setSecondCalls] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [stop, setStop] = React.useState(false);
    const [lastView, setLastView] = React.useState(null);

    const getSecondCalls = page => {

        setLoad(true);
        setPage(page);

        axios.post('secondcalls/get', { page, lastView }).then(({ data }) => {

            setSecondCalls(p => page === 1 ? data.calls : [...p, ...data.calls]);

            if (data.next > data.pages)
                setStop(true);

            if (page === 1)
                setLastView(data.view_at);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });
    }

    React.useEffect(() => {

        const scrolling = () => {

            const height = document.getElementById('root').offsetHeight;
            const screenHeight = window.innerHeight;
            const scrolled = window.scrollY;
            const threshold = height - screenHeight / 4;
            const position = scrolled + screenHeight;

            if (threshold >= position || load || stop || error) return;

            getSecondCalls(page + 1);

        }

        window.addEventListener('scroll', scrolling);

        return () => {
            window.removeEventListener('scroll', scrolling);
        }

    }, [secondCalls, load, page, stop, error])

    React.useEffect(() => getSecondCalls(1), []);

    return <div className="pb-3 px-2 w-100" id="sms-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Вторичные звонки</h4>
            </div>
        </div>

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}
            {loading && <div><Loader active inline="centered" /></div>}

            {!loading && !error && secondCalls.length === 0 && <div className="opacity-50 text-center my-4">
                <strong>Звонков не поступало</strong>
            </div>}

            {!loading && !error && secondCalls.length > 0 && <Comment.Group className="sms-group w-100" style={{ maxWidth: "100%" }}>
                {secondCalls.map(row => <SecondCallRow
                    key={row.id}
                    row={row}
                />)}
            </Comment.Group>}

            {!loading && load && <div><Loader active inline="centered" size="tiny" indeterminate /></div>}

            {!loading && !load && !error && stop && <div className="text-center opacity-50"><small>Это все звонки</small></div>}

        </div>

    </div>
}

const SecondCallRow = React.memo(props => {

    const { row } = props;

    return <div className="d-flex align-items-center mx-2 sms-rows">

        <Comment className="w-100 mt-2">

            <Comment.Content>

                <Comment.Author as="b">{row.phone}</Comment.Author>

                <Comment.Metadata style={{ float: "right" }}>
                    <div>{row.created_at && moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</div>
                </Comment.Metadata>

                {(row.created_pin || row.author) && <div>
                    <Comment.Metadata className="ml-0">
                        {row.created_pin && <b>@{row.created_pin} </b>}
                        {row.author && <span>{row.author}</span>}
                    </Comment.Metadata>
                </div>}

                <Comment.Text>
                    {row.names && row.names.length && <div>
                        Клиент представлялся: <i>{row.names.join('; ')}</i>
                    </div>}
                    {row.requests && row.requests.length === 0 && <div className="text-warning">Номер телефона не найден среди заявок</div>}
                </Comment.Text>

                {row.requests && row.requests.length > 0 && <Comment.Actions className="mb-2">
                    {row.requests.map(r => <Link key={`${row.id}_${r.id}`} to={`/requests?id=${r.id}`} className={`request-row-theme-${r.status?.theme || 0} px-2 py-1 rounded d-inline-block`}>
                        <b>{r.status?.name || "Не обработана"}</b>{' '}<span>#{r.id}</span>
                    </Link>)}
                </Comment.Actions>}

            </Comment.Content>

        </Comment>

        {row.new_row && <Label circular color="red" empty className="ml-2" title="Новое сообщение" />}

    </div>

});

export default SecondCalls;