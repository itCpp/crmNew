import React from 'react';

import { Button, Icon } from 'semantic-ui-react';

import CallcenterModal from './CallcenterModal';

function CallcenterList(props) {

    const { callcenters, setCallcenters } = props;
    const { select, setSelect, setUpdate } = props;
    const [edit, setEdit] = React.useState(null);

    const addCallcenter = row => {

        let list = [...callcenters],
            index = null;

        list.forEach((item, i) => {
            if (item.id === row.id) {
                index = i;
                list[i] = row;
            }
        });

        if (!index) {
            list.unshift(row);
            setSelect(row.id);
        }

        setCallcenters(list);
        
    };

    return <div className="admin-content-segment">

        {edit
            ? <CallcenterModal edit={edit} setOpen={setEdit} addCallcenter={addCallcenter} />
            : null
        }

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
                    onClick={() => setEdit(true)}
                />
            </div>

        </div>

        {callcenters.length
            ? callcenters.map(callcenter => {

                let className = [
                    'callcenter-select-row',
                    'd-flex', 'justify-content-between', 'align-items-center'
                ];

                if (select === callcenter.id)
                    className.push('callcenter-selected');

                return <div
                    key={callcenter.id}
                    className={className.join(" ")}
                    title={callcenter.comment || callcenter.name}
                >
                    <div
                        className="flex-grow-1"
                        onClick={() => {
                            setSelect(callcenter.id);
                            if (select === callcenter.id)
                                setUpdate(true);
                        }}
                    >
                        <div>{callcenter.name}</div>
                        {callcenter.comment
                            ? <div><small className="clip">{callcenter.comment}</small></div>
                            : null
                        }
                    </div>
                    <div>
                        <Icon
                            name="edit"
                            onClick={() => setEdit(callcenter.id)}
                            color="blue"
                            className="button-icon"
                            title="Редактировать данные"
                        />
                    </div>
                </div>
            })
            : <div className="mt-4 mb-3 text-center text-muted">
                <small>Создайте колл-центр</small>
            </div>
        }

    </div>

}

export default CallcenterList;