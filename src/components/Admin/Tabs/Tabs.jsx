import React from "react";
import axios from "./../../../utils/axios-header";

import { Header, Message, Loader } from "semantic-ui-react";

import CreateTab from "./CreateTab";
import TabsList from "./TabsList";

function Tabs() {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [tabs, setTabs] = React.useState([]);

    React.useEffect(() => {

        axios.post('dev/getTabs').then(({ data }) => {
            setTabs(data.tabs);
            setError(null);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Вкладки"
                subheader="Настройка вкладок выбора заявок"
            />

            {loading
                ? <Loader active inline />
                : <CreateTab
                    tabs={tabs}
                    setTabs={setTabs}
                />
            }

        </div>

        {error
            ? <Message error content={error} />
            : (loading
                ? null
                : <TabsList
                    tabs={tabs}
                    setTabs={setTabs}
                />
            )
        }

    </>

}

export default Tabs;