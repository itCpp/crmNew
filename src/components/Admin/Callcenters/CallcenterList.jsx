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

        {edit && <CallcenterModal
            edit={edit}
            setOpen={setEdit}
            addCallcenter={addCallcenter}
        />}

        <div className="divider-header">

            <h3>Колл-центры</h3>

            <div>
                <Button
                    icon="plus"
                    circular
                    basic
                    positive
                    size="mini"
                    title="Создать колл-центр"
                    onClick={() => setEdit(true)}
                />
            </div>

        </div>

        {callcenters.length > 0 && callcenters.map(callcenter => {

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

                    <div>
                        <Icon
                            name="power"
                            color={Boolean(callcenter?.active) ? "green" : "grey"}
                            disabled={!Boolean(callcenter?.active)}
                        />
                        <span>{callcenter.name}</span>
                        <span className="opacity-80 ml-2" title="Активные секторы / Всего секторов">
                            <span className="text-success">{callcenter.sectorCountActive}</span>
                            <span>/</span>
                            <span>{callcenter.sectorCount}</span>
                        </span>
                    </div>

                    {callcenter.comment && <div>
                        <small className="clip">{callcenter.comment}</small>
                    </div>}

                </div>
                <div>
                    <Icon
                        name="pencil"
                        onClick={() => setEdit(callcenter.id)}
                        color="blue"
                        className="button-icon"
                        title="Редактировать данные"
                    />
                </div>
            </div>
        })}


        {callcenters.length === 0 && <div className="mt-4 mb-3 text-center text-muted">
            <small>Создайте колл-центр</small>
        </div>}

    </div>

}

export default CallcenterList;