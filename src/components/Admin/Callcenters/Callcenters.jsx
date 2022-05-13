import React from 'react';
import axios from './../../../utils/axios-header';

import { Header, Loader, Message } from 'semantic-ui-react';

import CallcenterList from './CallcenterList';
import SectorList from './SectorList';

function Callcenters() {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [callcenters, setCallcenters] = React.useState([]);
    const [select, setSelect] = React.useState(null);
    const [update, setUpdate] = React.useState(null);
    const [defaultSector, setDefaultSector] = React.useState(null);

    React.useEffect(() => {

        setLoading(true);

        axios.post('admin/getCallcenters').then(({ data }) => {
            setError(null);
            setCallcenters(data.callcenters || []);
            setDefaultSector(data.sector_default);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {
        return () => setUpdate(null);
    }, [update]);

    return <div className="segment-compact">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Колл-центры"
                subheader="Управление колл-центрами и их секторами"
            />

            {loading && <Loader active inline />}

        </div>

        {error && <Message
            error
            header="Ошибка"
            list={[error]}
        />}

        {!error && !loading && defaultSector && <div className="admin-content-segment">

            <Header as="h5" content="Установлен сектор по умолчанию" />
            <div><small>В глобальных настройках выбран сектор колл-центра <b className="text-primary">{defaultSector.callcenter?.name || `#${defaultSector.callcenter_id}`} - {defaultSector.name}</b>, который будет использован для назначения новой заявке</small></div>

        </div>}

        {!error && !loading && <div className="d-flex justify-content-start align-items-start flex-segments">

            <CallcenterList
                callcenters={callcenters}
                setCallcenters={setCallcenters}
                select={select}
                setSelect={setSelect}
                setUpdate={setUpdate}
            />
            <SectorList
                select={select}
                update={update}
                setUpdate={setUpdate}
                setDefaultSector={setDefaultSector}
            />

        </div>}

    </div>

}

export default Callcenters;