import React from "react";
import axios from "./../../../utils/axios-header";
import { Message, Loader, Comment, Dropdown } from "semantic-ui-react";
import SmsRow from "./SmsRow";
import "./sms.css";

const Sms = () => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [sms, setSms] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [stop, setStop] = React.useState(false);
    const [lastView, setLastView] = React.useState(null);
    const [direction, setDirection] = React.useState(
        localStorage.getItem('smsFilterDirection') || "in"
    );

    const getSms = page => {

        setLoad(true);
        setPage(page);

        axios.post('sms/get', { page, lastView, direction }).then(({ data }) => {

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

    const newSms = React.useCallback(data => {

        setSms(prev => {

            let list = [...prev],
                inbox = [];

            if (data.rows) {
                inbox = data.rows;
            } else if (data.row) {
                inbox = [data.row];
            }

            inbox.forEach(item => {

                let newsms = { ...item, check_phone: true },
                    replace = null;

                list.forEach((row, i) => {
                    if (row.id === newsms.id) {
                        replace = i;
                        list[i] = newsms;
                    }
                });

                if (replace === null && (direction === "all" || newsms.direction === direction)) {
                    list.unshift(newsms);
                    list.splice(list.length - 1, 1);
                }
            });

            return list;
        });

    }, [direction]);

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

    }, [sms, load, page, stop]);

    React.useEffect(() => {
        setLoading(true);
        setStop(false);
        getSms(1);
    }, [direction]);

    React.useEffect(() => {

        window.Echo && window.Echo.private(`App.Crm.Sms.${window?.permits?.sms_access_system ? `All` : `Requests`}`)
            .listen('NewSmsAllEvent', newSms)
            .listen('NewSmsRequestsEvent', newSms);

        return () => {
            window.Echo && window.Echo.leave(`App.Crm.Sms.All`);
            window.Echo && window.Echo.leave(`App.Crm.Sms.Requests`);
        }

    }, []);

    return <div className="pb-3 px-2 w-100" id="sms-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">СМС сообщения</h4>
            </div>

            <Dropdown
                options={[
                    { key: 0, text: "Все", value: "all" },
                    { key: 1, text: "Входящие", value: "in" },
                    { key: 2, text: "Исходящие", value: "out" },
                ]}
                selection
                value={direction}
                onChange={(e, { value }) => {
                    localStorage.setItem("smsFilterDirection", value);
                    setDirection(value);
                }}
                disabled={loading}
            />

        </div>

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}
            {loading && <div><Loader active inline="centered" /></div>}

            {!loading && !error && sms.length === 0 && <div className="opacity-50 text-center my-4">
                <strong>Сообщений нет</strong>
            </div>}

            {!loading && !error && sms.length > 0 && <Comment.Group className="sms-group w-100" style={{ maxWidth: "100%" }}>
                {sms.map((row, i) => <SmsRow
                    key={`${row.id}_${i}`}
                    sms={row}
                    setSms={setSms}
                />)}
            </Comment.Group>}

            {!loading && load && <div><Loader active inline="centered" size="tiny" indeterminate /></div>}

            {!loading && !load && !error && stop && sms.length > 0 && <div className="text-center opacity-50"><small>Это все сообщения</small></div>}

        </div>

    </div>
}

export default Sms;