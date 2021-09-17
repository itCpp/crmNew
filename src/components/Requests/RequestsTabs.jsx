import { connect } from 'react-redux';
import { selectTab } from "./../../store/requests/actions";

const RequestsTabs = props => {

    const { tabs, select, selectTab } = props;

    const setSelect = id => {
        selectTab(id);
        localStorage.setItem('select_tab', id);
    }

    if (tabs.length && !tabs.find(i => i.id === select))
        setSelect(null);    

    return <div className="tab-list">

        {tabs.map(tab => {

            let className = ["tab-list-row"];

            if (select === tab.id)
                className.push("tab-list-active");

            return <div key={tab.id} title={tab.name_title || tab.name} className={className.join(" ")} onClick={() => setSelect(tab.id)}>
                <span>{tab.name}</span>
            </div>
        })}

    </div>

}

const mapStateToProps = state => ({
    tabs: state.requests.tabs,
    select: state.requests.select,
});

export default connect(mapStateToProps, { selectTab })(RequestsTabs);