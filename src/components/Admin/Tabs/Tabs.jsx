import React from "react";
import axios from "./../../../utils/axios-header";
import { withRouter } from "react-router";

import { Header, Message, Loader } from "semantic-ui-react";

import CreateTab from "./CreateTab";
import TabsList from "./TabsList";
import Tab from "./TabData/Tab";

function Tabs(props) {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [tabs, setTabs] = React.useState([]);
    const [tab, setTab] = React.useState(null);

    React.useEffect(() => {

        if (tab === null) {

            setLoading(true);

            axios.post('dev/getTabs').then(({ data }) => {
                setTabs(data.tabs);
                setError(null);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [tab]);

    React.useEffect(() => {
        setTab(props?.match?.params?.type ? Number(props.match.params.type) : null);
    }, [props?.match?.params?.type]);

    if (tab) {
        return <Tab
            {...props}
            tab={tab}
            tabs={tabs}
            setTabs={setTabs}
        />
    }

    return <div className="segment-compact">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Вкладки"
                subheader="Настройка вкладок выбора заявок"
            />

            {loading && <Loader active inline />}
            {!loading && <CreateTab
                tabs={tabs}
                setTabs={setTabs}
            />}

        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <TabsList
            tabs={tabs}
            setTabs={setTabs}
            pushUrl={props.history.push}
        />}

    </div>

}

export default withRouter(Tabs);