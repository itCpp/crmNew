import React from "react";
import moment from "./../../../utils/moment";
import { Link } from "react-router-dom";
import { Comment, Icon, Label } from "semantic-ui-react";
import { axios } from "../../../utils";

const SmsRow = React.memo(props => {

    const { sms, setSms } = props;
    const [phone, setPhone] = React.useState(null);

    React.useEffect(() => {
        if (sms?.check_phone === true) {
            axios.post('requests/getSmsPhone', { id: sms.id }).then(({ data }) => {
                setPhone(data.row.phone);
            });
        }
    }, [sms?.check_phone]);

    let error = null;

    if (sms.response && sms.response?.Response !== "Success") {
        error = sms.response?.Message || `Ошибка ${sms.response?.ResponseCode}`;
    }

    let name = phone || sms.phone,
        gate = sms.gateName || null;

    if (gate && sms.channel)
        gate += "@" + sms.channel;

    if (sms.direction === "in") {
        name = <>{phone || sms.phone}<Icon name="angle right" className="mx-1" />{gate}</>
    }
    if (sms.direction === "out") {
        name = <>{gate}<Icon name="angle right" className="mx-1" />{phone || sms.phone}</>
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
                        {sms.new_sms && <Label circular color="orange" empty className="ml-2" title="Новое сообщение" size="mini" />}
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

                {window?.requestPermits?.requests_access && sms.requests && sms.requests.length > 0 && <Comment.Actions className="mb-2">
                    {sms.requests.map(r => <Link key={`${sms.id}_${r.id}`} to={`/requests?id=${r.id}`}>#{r.id}</Link>)}
                </Comment.Actions>}

            </Comment.Content>

        </Comment>

    </div>
});

export default SmsRow;