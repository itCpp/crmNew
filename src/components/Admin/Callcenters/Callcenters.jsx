import React from 'react';
import axios from './../../../utils/axios-header';

import { Header, Loader, Message } from 'semantic-ui-react';

import CallcenterList from './CallcenterList';
import SectorList from './SectorList';

function Callcenters(props) {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [callcenters, setCallcenters] = React.useState([]);
    const [select, setSelect] = React.useState(null);
    const [update, setUpdate] = React.useState(null);

    React.useEffect(() => {

        setLoading(true);

        axios.post('admin/getCallcenters').then(({ data }) => {
            setError(null);
            setCallcenters(data.callcenters || []);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <>

        <div className="admin-content-segment">

            <Header
                as="h2"
                content="Колл-центры"
                subheader="Управление колл-центрами и их секторами"
            />

        </div>

        {error
            ? <Message
                error
                header="Ошибка"
                list={[error]}
            />
            : null
        }

        {loading ? <div className="text-center my-3"><Loader active inline /></div> : null}


        {!error && !loading
            ? <div className="d-flex justify-content-start align-items-start flex-segments">

                <CallcenterList
                    callcenters={callcenters}
                    select={select}
                    setSelect={setSelect}
                    setUpdate={setUpdate}
                />
                <SectorList
                    select={select}
                    update={update}
                    setUpdate={setUpdate}
                />

            </div>
            : null
        }

    </>

}

export default Callcenters;