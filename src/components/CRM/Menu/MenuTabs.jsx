import React from "react";
import { connect } from "react-redux";
import { selectTab, setSearchRequest, selectedUpdateTab } from "./../../../store/requests/actions";
import { Icon } from "semantic-ui-react";

export const CounterRow = React.memo(props => {

    const { count, update } = props;
    const counter = React.useRef();

    React.useEffect(() => {
        counter.current && counter.current.classList.add('counter-updated');
        setTimeout(() => counter.current && counter.current.classList.remove('counter-updated'), 300);
    }, [count]);

    React.useEffect(() => {

        if (update) {
            counter.current && counter.current.classList.add('counter-new-data');
        }
        else {
            counter.current && counter.current.classList.remove('counter-new-data');
        }

    }, [update]);

    return count && <small ref={counter}>{count}</small>

})

const MenuTabs = props => {

    const { selectMenu, setSearchRequest, requestsLoading } = props;
    const { tabs } = props;
    const { select, selectTab, selectedUpdate, selectedUpdateTab } = props;
    const { counter, push, replace } = props;

    const setSelect = id => {

        if (selectMenu.indexOf('requests') < 0)
            push("/requests");
        else
            replace("/requests");

        if (id === select)
            return selectedUpdateTab(!selectedUpdate);

        selectTab(id);
        setSearchRequest(null);

        localStorage.setItem('select_tab', id);

    }

    React.useEffect(() => {
        if (tabs.length && !tabs.find(i => i.id === select)) {
            setSelect(null);
        }
    }, []);

    let classNames = ["menu-list-block"];

    if ((select || select === 0) && (selectMenu === "/" || selectMenu.indexOf('requests') >= 0))
        classNames.push('menu-list-block-active');

    return <div className={classNames.join(' ')}>

        <div className="menu-list-row title">

            <div className="menu-list-point">
                <Icon name="table" />
                <span>Заявки</span>
            </div>

        </div>

        {tabs.map(tab => {

            let className = ["menu-list-row sub-row"];

            if (select === tab.id && classNames.indexOf('menu-list-block-active') >= 0)
                className.push("tab-list-active");

            return <div
                key={tab.id}
                title={tab.name_title || tab.name}
                className={className.join(" ")}
                onClick={() => requestsLoading ? null : setSelect(tab.id)}
            >
                <span className="select-point">
                    <Icon
                        name="chevron right"
                        size="small"
                    />
                </span>
                <span>{tab.name}</span>
                <CounterRow count={counter[`tab${tab.id}`]?.count || null} />
            </div>
        })}

    </div>

}

const mapStateToProps = state => ({
    tabs: state.requests.tabs,
    select: state.requests.select,
    selectedUpdate: state.requests.selectedUpdate,
    counter: state.requests.counter,
    requestsLoading: state.requests.requestsLoading,
});

export default connect(mapStateToProps, {
    selectTab, setSearchRequest, selectedUpdateTab
})(MenuTabs);