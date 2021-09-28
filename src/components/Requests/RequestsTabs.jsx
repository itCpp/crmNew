import { connect } from 'react-redux';
import { selectTab } from "./../../store/requests/actions";

import { Icon } from "semantic-ui-react";

const RequestsTabs = props => {

    const { tabs, select, selectTab } = props;
    const { selectMenu, openSubMenu } = props;

    const setSelect = id => {
        selectTab(id);
        localStorage.setItem('select_tab', id);
    }

    if (tabs.length && !tabs.find(i => i.id === select))
        setSelect(null);

    return <div className={`menu-list-block ${select ? "menu-list-block-active" : ""}`} data-active={selectMenu.indexOf('requests') >= 0 ? true : false}>

        <div className="menu-list-row" onClick={() => openSubMenu('requests')}>
            <div className="menu-list-point">
                <Icon name="table" />
                <span>Заявки</span>
            </div>
            <span className="open-btn">
                <Icon
                    name="chevron right"
                    size="small"
                    className="rotate"
                />
            </span>
        </div>

        <div className="tab-list">

            {tabs.map(tab => {

                let className = ["menu-list-row"];

                if (select === tab.id)
                    className.push("tab-list-active");

                return <div key={tab.id} title={tab.name_title || tab.name} className={className.join(" ")} onClick={() => setSelect(tab.id)}>
                    <span>{tab.name}</span>
                </div>
            })}

        </div>

    </div>

}

const mapStateToProps = state => ({
    tabs: state.requests.tabs,
    select: state.requests.select,
});

export default connect(mapStateToProps, { selectTab })(RequestsTabs);