import React from 'react'

import Sites from './Sites'
import TabName from './TabName'
import TabButton from './TabButton'
import TabAdd from './TabAdd'

import { Loader, Message } from 'semantic-ui-react';

export default function Tabs(props) {

    const [active, setActive] = React.useState(null);
    const [activeUpdate, setActiveUpdate] = React.useState(false);

    React.useEffect(() => props.setActive(active), [active]);
    React.useEffect(() => {

        props.setActiveUpdate(activeUpdate);
        return () => setActiveUpdate(false);

    }, [activeUpdate]);

    const tabs = props.tabs.map(row => {

        const rows = row.tabs.map(tab => <TabButton
            key={tab.id}
            row={tab}
            setActive={setActive}
            setActiveUpdate={setActiveUpdate}
            active={active}
        />);

        const name = <TabName name={row.name} />

        return <div key={row.name} className="mb-3">
            {name}
            {rows}
        </div>

    });

    return <div className="tabs-selecter px-2 py-3">

        <Sites
            site={props.site}
            sites={props.sites}
            setSite={props.setSite}
            loadingData={props.loadingData}
            errorSites={props.errorSites}
        />

        <TabAdd
            setTabs={props.setTabs}
            site={props.site}
            setSites={props.setSites}
        />

        {props.loadingTabs ? <div className="loading-data">
            <Loader active inline="centered" size="small" />
        </div> : null}

        {props.errorTabs ? <Message negative size="mini">Ошибка загрузки списка плашек: {props.errorTabs}</Message> : null}

        {!props.loadingTabs ? <div className="overflow-auto">
            {tabs}
        </div> : null}

    </div>

}