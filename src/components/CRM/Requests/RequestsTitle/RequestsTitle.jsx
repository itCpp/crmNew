import React from "react";
import { useSelector } from "react-redux";
import { Icon, Label, Button } from "semantic-ui-react";
import RequestsSearch from "./../RequestsSearch";
import RequestAdd from "./RequestAdd";

const RequestsTitle = React.memo(props => {

    const { select, tabs, counter } = useSelector(state => state.requests);
    const [add, setAdd] = React.useState(false);

    const tab = tabs.find(item => item.id === select);
    const count = tab && counter && counter[`tab${tab.id}`];

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
            {window?.requestPermits?.requests_add && <>
                <Button
                    icon="plus"
                    color="green"
                    circular
                    title="Создать заявку"
                    basic
                    onClick={() => setAdd(true)}
                />
                {add && <RequestAdd setOpen={setAdd} />}
            </>}

            <RequestsSearch {...props} />
        </div>

    </div>

});

export default RequestsTitle;