import React from 'react';
import axios from "./../../../utils/axios-header";
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
    arrayMove
} from 'react-sortable-hoc';

import { Message, Loader, Dimmer, Icon, List } from "semantic-ui-react";

const DragHandle = sortableHandle(() => <Icon name="move" className="button-icon" />);

const SortableItem = sortableElement(({ tab, pushUrl }) => (
    <List.Item className="tabs-list-hover">
        <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <List.Content>
                <DragHandle />
                <span>{tab.name}</span>
            </List.Content>
            <List.Content>
                <Icon
                    name="edit outline"
                    className="button-icon"
                    title="Настройка статуса"
                    onClick={() => pushUrl(`/admin/tabs/${tab.id}`)}
                />
            </List.Content>
        </div>

    </List.Item>
));

const SortableContainer = sortableContainer(({ children }) => {
    return <List celled>{children}</List>;
});

function TabsList(props) {

    const { tabs, setTabs } = props;
    const [load, setLoad] = React.useState(false);

    const onSortEnd = ({ oldIndex, newIndex }) => {

        setLoad(true);

        let newTabs = arrayMove(tabs, oldIndex, newIndex);

        axios.post('dev/tabsPosition', newTabs.map((tab, i) => ({
            id: tab.id, position: i,
        }))).then(() => {
            setTabs(newTabs);
        }).catch(error => {
            axios.toast(error);
        }).then(() => {
            setLoad(false);
        });
    }

    if (!tabs.length)
        return <Message info content="Создайте первую вкладку" />

    return <div className="d-flex justify-content-start align-items-start flex-segments">

        <div className="admin-content-segment pt-4 position-relative">

            <SortableContainer onSortEnd={onSortEnd} useDragHandle lockAxis="y" helperClass="tab-list-move">
                {tabs.map((tab, index) => (
                    <SortableItem
                        {...props}
                        key={tab.id}
                        index={index}
                        tab={tab}
                    />
                ))}
            </SortableContainer>

            <Dimmer active={load} inverted>
                <Loader inverted />
            </Dimmer>

        </div>

    </div>

}

export default TabsList;