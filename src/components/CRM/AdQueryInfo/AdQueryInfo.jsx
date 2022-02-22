import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Modal, Placeholder, Tab } from "semantic-ui-react";
import { setShowAdInfo } from "../../../store/requests/actions";
import { axios } from "../../../utils";
import AdQueryCalls from "./AdQueryCalls";

const AdQueryInfo = () => {

    const dispatch = useDispatch();
    const { showAdInfo } = useSelector(state => state.requests);
    const open = showAdInfo ? true : false;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [calls, setCalls] = React.useState([]);

    const close = React.useCallback(() => {
        dispatch(setShowAdInfo(null));
    }, []);

    React.useEffect(() => {

        if (open) {
            setLoading(true);

            axios.post('requests/ad/get', { id: showAdInfo?.id }).then(({ data }) => {
                setCalls(data.calls || []);
                setError(null);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
        } else if (open === null) {
            setError(null);
            setCalls([]);
        }

    }, [open]);

    const panes = [
        {
            menuItem: "Текст",
            render: () => <div>
                Текст
            </div>
        },
        {
            menuItem: "Звонки",
            render: () => <AdQueryCalls data={calls} />
        }
    ];

    return <Modal
        header="Обращения по рекламе"
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
                menu={{ secondary: true, pointing: true }}
                panes={panes}
                onTabChange={console.log}
            />}

        </div>}
    />

}

export default AdQueryInfo;