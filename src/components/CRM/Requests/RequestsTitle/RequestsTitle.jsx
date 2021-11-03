import React from "react";
import { useSelector } from "react-redux";
import { Icon, Label } from "semantic-ui-react";
import RequestsSearch from "./../RequestsSearch";

const RequestsTitle = React.memo(props => {

    const select = useSelector(state => state.requests.select);
    const tabs = useSelector(state => state.requests.tabs);
    const counts = useSelector(state => state.requests.counter);

    const tab = tabs.find(item => item.id === select);
    const count = tab && counts && counts[`tab${tab.id}`];

    return <div className="d-flex justify-content-between align-items-center">

        <div className="page-title-box">

            <h4 className="page-title">Заявки</h4>

            {tab?.name &&
                <div className="page-title-subox">
                    <Icon name="chevron right" />
                    <span>{tab.name}</span>
                    {count && count.count > 0 && <Label
                        content={count.count}
                        size="mini"
                        color="green"
                    />}
                </div>
            }

            {select === 0 &&
                <div className="page-title-subox">
                    <Icon name="chevron right" />
                    <span>Поиск заявок</span>
                </div>
            }

        </div>

        <div>
            <RequestsSearch {...props} />
        </div>

    </div>

});

export default RequestsTitle;