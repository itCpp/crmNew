import React from "react";
import axios from "./../../../utils/axios-header";
import moment from "./../../../utils/moment";
import { Link } from "react-router-dom";

import { Message, Loader, Comment, Icon, Label } from "semantic-ui-react";

import "./sms.css";

const Sms = () => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [sms, setSms] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [stop, setStop] = React.useState(false);
    const [lastView, setLastView] = React.useState(null);

    const getSms = page => {

        setLoad(true);
        setPage(page);

        axios.post('sms/get', { page, lastView }).then(({ data }) => {

            setSms(p => page === 1 ? data.messages : [...p, ...data.messages]);

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

            if (threshold >= position || load || stop) return;

            getSms(page + 1);

        }

        window.addEventListener('scroll', scrolling);

        return () => {
            window.removeEventListener('scroll', scrolling);
        }

    }, [sms, load, page, stop])

    React.useEffect(() => getSms(1), []);

    return <div className="pb-3 px-2 w-100" id="sms-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">СМС сообщения</h4>
            </div>
        </div>

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}
            {loading && <div><Loader active inline="centered" /></div>}

            {!loading && !error && sms.length === 0 && <div className="opacity-50 text-center my-4">
                <strong>Сообщений нет</strong>
            </div>}

            {!loading && !error && sms.length > 0 && <Comment.Group className="sms-group w-100" style={{ maxWidth: "100%" }}>
                {sms.map(row => <SmsRow
                    key={row.id}
                    sms={row}
                />)}
            </Comment.Group>}

            {!loading && load && <div><Loader active inline="centered" size="tiny" indeterminate /></div>}

            {!loading && !load && !error && stop && <div className="text-center opacity-50"><small>Это все сообщения</small></div>}

        </div>

    </div>
}

const SmsRow = React.memo(props => {

    const { sms } = props;

    let error = null;

    if (sms.response && sms.response?.Response !== "Success") {
        error = sms.response?.Message || `Ошибка ${sms.response?.ResponseCode}`;
    }

    let name = sms.phone,
        gate = sms.gateName || null;

    if (gate && sms.channel)
        gate += "@" + sms.channel;

    if (sms.direction === "in") {
        name = <>{sms.phone}<Icon name="angle right" className="mx-1" />{gate}</>
    }
    if (sms.direction === "out") {
        name = <>{gate}<Icon name="angle right" className="mx-1" />{sms.phone}</>
    }

    return <div className="d-flex align-items-center mx-2 sms-rows">

        {sms.direction === "in" && <div title="Входящее СМС" className="mr-3 opacity-50">
            <Icon
                name="angle double right"
                fitted
                size="large"
                color="green"
            />
        </div>}

        {sms.direction === "out" && <div title="Исходящее СМС" className="mr-3 opacity-50">
            <Icon
                name="angle double left"
                fitted
                size="large"
                color="orange"
            />
        </div>}

        <Comment className="w-100 mt-0">

            <Comment.Content>

                <Comment.Author as="b">{name}</Comment.Author>

                <Comment.Metadata style={{ float: "right" }}>
                    <div className="d-flex align-items-center">
                        <span>{sms.sent_at && moment(sms.sent_at).format("DD.MM.YYYY в HH:mm")}</span>
                        {sms.new_sms && <Label circular color="orange" empty className="ml-2" title="Новое сообщение" size="mini"/>}
                    </div>
                    
                </Comment.Metadata>

                {(sms.created_pin || sms.author) && <div>
                    <Comment.Metadata className="ml-0">
                        {sms.created_pin && <b>@{sms.created_pin} </b>}
                        {sms.author && <span>{sms.author}</span>}
                    </Comment.Metadata>
                </div>}

                <Comment.Text>
                    {sms.message}
                    {error && <div className="text-danger mt-1" style={{ fontSize: "80%" }}>
                        <Icon name="warning sign" />
                        <strong>{error}</strong>
                    </div>}
                </Comment.Text>

                {sms.requests && sms.requests.length > 0 && <Comment.Actions className="mb-2">
                    {sms.requests.map(r => <Link key={`${sms.id}_${r.id}`} to={`/requests?id=${r.id}`}>#{r.id}</Link>)}
                </Comment.Actions>}

            </Comment.Content>

        </Comment>

    </div>

});

export default Sms;