import { useState, useCallback } from "react";
import axios from "./../../../../utils/axios-header";
import { Checkbox, Dimmer, Loader } from "semantic-ui-react";

const TabStatusesRows = props => {

    const { tab, setRow, statuses } = props;
    const [load, setLoad] = useState(null);

    const onChange = useCallback((e, { status, checked }) => {

        setLoad(status);

        axios.post('dev/setTabStatus', {
            tab: tab.id,
            id: status,
            checked
        }).then(({ data }) => {
            setRow(data.tab);
        }).catch(error => {
            axios.toast(error);
        }).then(() => {
            setLoad(null);
        });

    }, []);

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Статусы заявок для вывода</h3>
        </div>

        {statuses.map(status => <div className="d-flex align-items-center mb-1" key={status.id}>
            <div className="mr-3 position-relative">

                <Checkbox
                    toggle
                    onChange={onChange}
                    className="mb-0 mt-1"
                    status={status.id}
                    value=""
                    disabled={load ? true : false}
                    checked={tab.statuses && tab.statuses.indexOf(status.id) >= 0}
                />

                <Dimmer active={load === status.id} inverted>
                    <Loader inverted size="small" />
                </Dimmer>

            </div>

            <div className="mb-1">{status.name}</div>

        </div>)}

    </div>

}

export default TabStatusesRows;