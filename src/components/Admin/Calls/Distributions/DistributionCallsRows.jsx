import { useState, useEffect, useCallback } from "react";
import axios from "./../../../../utils/axios-header";
import { List, Checkbox, Dimmer, Loader } from "semantic-ui-react";

const DistributionCallsRow = props => {

    const { sectors, setSectors, setRows } = props;
    const [loading, setLoading] = useState(false);

    const changeChecked = useCallback((e, { value, checked }) => {

        setLoading(true);
        
        axios.post('admin/setSectorDistribution', { id: value, checked }).then(({ data }) => {
            setRows(data.rows);
            setSectors(data.sectors);
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div>

        {sectors && sectors.length > 0 && <div>

            <div className="divider-header">
                <div>
                    <h3>Использование сектора в распределении</h3>
                    <div><small>Ниже представлен список активных секторов, чтобы учитывать сектор в распределении звонков, необходимо включить его</small></div>
                </div>
            </div>

            <List divided relaxed className="list-admin">
                {sectors.map(row => <List.Item key={row.id}>
                    <List.Content className="d-flex justify-content-between align-items-center px-3">
                        <div>
                            <List.Header>{row.name}{' '}#{row.id}</List.Header>
                            {row.comment && <List.Description>{row.comment}</List.Description>}
                        </div>
                        <div title={row.distribition_active ? "Исключить из распределения" : "Включить в распределение"}>
                            <Checkbox
                                toggle
                                checked={row.distribition_active ? true : false}
                                onChange={changeChecked}
                                value={row.id}
                            />
                        </div>
                    </List.Content>
                </List.Item>)}
            </List>
        </div>}

        {loading && <Dimmer active inverted><Loader /></Dimmer>}

    </div>

}

export default DistributionCallsRow;