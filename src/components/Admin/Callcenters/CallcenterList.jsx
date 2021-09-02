import { Button } from 'semantic-ui-react';

function CallcenterList(props) {

    const { callcenters, select, setSelect, setUpdate } = props;

    return <div className="admin-content-segment">

        <div className="divider-header">

            <h3>Колл-центры</h3>

            <div>
                <Button
                    icon="plus"
                    circular
                    basic
                    primary
                    size="mini"
                    title="Создать колл-центр"
                    disabled={true}
                />
            </div>

        </div>

        {callcenters.length
            ? callcenters.map(callcenter => {

                let className = ['callcenter-select-row'];

                if (select === callcenter.id)
                    className.push('callcenter-selected');

                return <div
                    key={callcenter.id}
                    onClick={() => {
                        setSelect(callcenter.id);
                        if (select === callcenter.id)
                            setUpdate(true);
                    }}
                    className={className.join(" ")}
                >
                    {callcenter.name}
                </div>
            })
            : <div className="mt-4 mb-3 text-center text-muted">
                <small>Создайте колл-центр</small>
            </div>
        }

    </div>

}

export default CallcenterList;