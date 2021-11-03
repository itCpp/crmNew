import React from "react";
import { connect } from "react-redux";
import { selectTab, setSearchRequest } from "./../../../store/requests/actions";
import { Icon } from "semantic-ui-react";

const MenuTabs = props => {

    const { selectMenu, setSearchRequest } = props;
    const { tabs } = props;
    const { select, selectTab } = props;
    const { counter } = props;

    // console.log("MenuTabs", props);

    const setSelect = id => {

        // if (id === select)
        //     return selectedUpdateTab(true);

        selectTab(id);
        setSearchRequest(null);
        localStorage.setItem('select_tab', id);

    }

    React.useEffect(() => {
        if (tabs.length && !tabs.find(i => i.id === select))
            setSelect(null);
    }, []);

    return <div
        className={`menu-list-block ${(select || select === 0) ? "menu-list-block-active" : ""}`}
        data-active={selectMenu && selectMenu.indexOf('requests') >= 0 ? true : false}
    >

        <div className="menu-list-row title">

            <div className="menu-list-point">
                <Icon name="table" />
                <span>Заявки</span>
            </div>

        </div>

        {tabs.map(tab => {

            let className = ["menu-list-row sub-row"];

            if (select === tab.id)
                className.push("tab-list-active");

            return <div
                key={tab.id}
                title={tab.name_title || tab.name}
                className={className.join(" ")}
                onClick={() => setSelect(tab.id)}
            >
                <span className="select-point">
                    <Icon
                        name="chevron right"
                        size="small"
                    />
                </span>
                <span>{tab.name}</span>
                <small>{counter[`tab${tab.id}`]?.count || ""}</small>
            </div>
        })}

    </div>

}

const mapStateToProps = state => ({
    tabs: state.requests.tabs,
    select: state.requests.select,
    counter: state.requests.counter,
});

export default connect(mapStateToProps, {
    selectTab, setSearchRequest
})(MenuTabs);