import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Modal, Placeholder, Tab, Label, Menu } from "semantic-ui-react";
import { setShowAdInfo } from "../../../store/requests/actions";
import { axios } from "../../../utils";
import AdQueryCalls from "./AdQueryCalls";
import AdQueryIps from "./AdQueryIps";
import AdQueryTexts from "./AdQueryTexts";

const AdQueryInfo = () => {

    const dispatch = useDispatch();
    const { showAdInfo } = useSelector(state => state.requests);
    const open = showAdInfo ? true : false;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [calls, setCalls] = React.useState([]);
    const [texts, setTexts] = React.useState([]);
    const [ips, setIps] = React.useState([]);
    const [counts, setCounts] = React.useState({});
    const [activeIndex, setActiveIndex] = React.useState(0);

    const close = React.useCallback(() => {
        dispatch(setShowAdInfo(null));
    }, []);

    React.useEffect(() => {

        if (open) {
            setLoading(true);

            axios.post('requests/ad/get', { id: showAdInfo?.id }).then(({ data }) => {

                setTexts(data.texts || []);
                setCalls(data.calls || []);
                setIps(data.ips || []);
                setCounts(data.counts);

                if (data.calls.length === 0 && data.texts.length > 0)
                    setActiveIndex(1);
                else if (data.texts.length === 0 && data.ips.length > 0)
                    setActiveIndex(2);
                else
                    setActiveIndex(0);

                setError(null);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
        } else if (open === null) {
            setError(null);
            setCalls([]);
            setTexts([]);
            setIps([]);
            setCounts({});
        }

    }, [open]);

    const panes = [
        {
            menuItem: <Menu.Item key='calls'>
                Звонки<Label color="blue">{calls.length || 0}</Label>
            </Menu.Item>,
            render: () => <AdQueryCalls data={calls} />
        },
        {
            menuItem: <Menu.Item key='texts'>
                Текст<Label color="blue">{texts.length || 0}</Label>
            </Menu.Item>,
            render: () => <AdQueryTexts data={texts} />
        },
        {
            menuItem: <Menu.Item key='ips'>
                IP<Label color="blue">{counts.ips || 0}</Label>
            </Menu.Item>,
            render: () => <AdQueryIps data={ips} />
        }
    ];

    return <Modal
        header="История обращений"
        open={open}
        centered={false}
        closeIcon={<Icon name="close" link fitted onClick={close} />}
        content={<div className="content">

            {loading && <div>
                <Placeholder fluid className="rounded mb-2 mt-0" style={{ height: "2rem" }} />
                <Placeholder fluid className="rounded mb-2 mt-0" style={{ height: "2rem" }} />
                <Placeholder fluid className="rounded mb-2 mt-0" style={{ height: "2rem" }} />
            </div>}

            {!loading && !error && <Tab
                activeIndex={activeIndex}
                menu={{ secondary: true }}
                panes={panes}
                onTabChange={(e, { activeIndex }) => setActiveIndex(activeIndex)}
            />}

        </div>}
    />

}

export default AdQueryInfo;