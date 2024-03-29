import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { selectTab, setSearchRequest, selectedUpdateTab } from "./../../../store/requests/actions";
import { Icon, Popup, Label } from "semantic-ui-react";
import CounterFlash from "./CounterFlash";

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
    const { tabs, shortMenu } = props;
    const { select, selectTab, selectedUpdate, selectedUpdateTab } = props;
    const { counter, push, replace } = props;

    const setSelect = id => {

        localStorage.setItem('select_tab', id);

        if (id === null)
            return null;

        if (selectMenu.indexOf('requests') < 0)
            push("/requests");
        else
            replace("/requests");

        if (id === select)
            return selectedUpdateTab(!selectedUpdate);

        selectTab(id);
        setSearchRequest(null);
    }

    React.useEffect(() => {
        if (tabs.length && !tabs.find(i => i.id === select)) {
            setSelect(null);
        }
    }, []);

    let classNames = ["menu-list-block"];

    if (((select || select === 0) && (selectMenu.indexOf('requests') >= 0)) || selectMenu.indexOf('requests') >= 0)
        classNames.push('menu-list-block-active');

    return <div className={classNames.join(' ')}>

        <CounterFlash
            counter={counter}
            notProcessed={Number(counter.flash_null)}
            setSelect={setSelect}
        />

        <Link to="/requests" className="menu-list-row title" title="Заявки">

            <div className="menu-list-point">
                <Icon name="table" />
                <span className="title-point">Заявки</span>
            </div>

        </Link>

        {tabs.map(tab => {

            let className = ["menu-list-row sub-row"];

            if (select === tab.id && classNames.indexOf('menu-list-block-active') >= 0)
                className.push("tab-list-active");

            const Row = <div
                key={tab.id}
                title={`${tab.name_title || tab.name} - ${counter[`tab${tab.id}`]?.count || 0}`}
                className={className.join(" ")}
                onClick={() => requestsLoading ? null : setSelect(tab.id)}
            >
                <span className="select-point">
                    <Icon
                        name="chevron right"
                        size="small"
                        fitted={shortMenu}
                    />
                </span>
                <span className="title-point">{tab.name}</span>
                <CounterRow
                    count={counter[`tab${tab.id}`]?.count || null}
                    update={Boolean(counter[`tab${tab.id}`]?.update)}
                />
                {Boolean(counter[`tab${tab.id}`]?.update) && <Label
                    circular
                    color="orange"
                    size="mini"
                    empty
                    className="update-info-buble"
                />}
            </div>;

            return shortMenu ? <Popup
                key={tab.id}
                trigger={Row}
                content={<span>{tab.name} {Boolean(counter[`tab${tab.id}`]?.count || null) && <b className="ml-2">{counter[`tab${tab.id}`]?.count || null}</b>}</span>}
                position="right center"
                size="mini"
                inverted
                style={{
                    padding: ".25rem 1rem",
                    opacity: ".9",
                }}
            /> : Row;
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