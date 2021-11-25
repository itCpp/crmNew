import React from "react";
import axios from "./../../../utils/axios-header";
import moment from "./../../../utils/moment";

import { Message, Loader, Comment, Icon, Label } from "semantic-ui-react";

import "./sms.css";

const Sms = props => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [sms, setSms] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [stop, setStop] = React.useState(false);

    const getSms = page => {

        setLoad(true);
        setPage(page);

        axios.post('sms/get', { page }).then(({ data }) => {

            setSms(p => page === 1 ? data.messages : [...p, ...data.messages]);

            if (data.next > data.pages)
                setStop(true);

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

        </div>

    </div>
}

const SmsRow = React.memo(props => {

    const { sms } = props;

    //angle double right

    let error = null;

    if (sms.response && sms.response?.Response !== "Success") {
        error = sms.response?.Message || `Ошибка ${sms.response?.ResponseCode}`;
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

                <Comment.Author as="b">{sms.phone}</Comment.Author>

                <Comment.Metadata>
                    {sms.created_pin && <div>
                        <b>@{sms.created_pin}</b>
                        {sms.author && <span> {sms.author}</span>}
                    </div>}
                    <div>{moment(sms.created_at).format("YYYY.MM.DD в HH:mm")}</div>
                </Comment.Metadata>

                <Comment.Text>
                    {sms.message}
                    {error && <div className="text-danger mt-1" style={{ fontSize: "80%" }}>
                        <Icon name="warning sign" />
                        <strong>{error}</strong>
                    </div>}
                </Comment.Text>

                {sms.requests && sms.requests.length > 0 && <Comment.Actions className="mb-2">
                    {sms.requests.map(r => <Comment.Action key={`${sms.id}_${r.id}`}>#{r.id}</Comment.Action>)}
                </Comment.Actions>}

            </Comment.Content>

        </Comment>

        {sms.new_sms && <Label circular color="red" empty />}

    </div>

});

export default Sms;