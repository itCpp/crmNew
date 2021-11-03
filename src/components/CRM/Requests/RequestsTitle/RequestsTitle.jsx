import React from "react";
import { useSelector } from "react-redux";
import { Icon, Label } from "semantic-ui-react";

const RequestsTitle = React.memo(() => {

    const select = useSelector(state => state.requests.select);
    const tabs = useSelector(state => state.requests.tabs);
    const counts = useSelector(state => state.requests.counter);

    const tab = tabs.find(item => item.id === select);
    const count = counts && counts[`tab${tab.id}`];

    return <div className="d-flex justify-content-between align-items-center">

        <div className="page-title-box">

            <h4 className="page-title">Заявки</h4>

            {tab?.name &&
                <div className="page-title-subox">
                    <Icon name="chevron right" />
                    <span>{tab.name}</span>
                    {count && <Label
                        content={count.count}
                        size="mini"
                        color="green"
                    />}
                </div>
            }

        </div>

    </div>

});

export default RequestsTitle;