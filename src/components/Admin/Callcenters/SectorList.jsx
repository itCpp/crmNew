import React from 'react';
import axios from './../../../utils/axios-header';

import { Button, Loader } from 'semantic-ui-react';

import SectorModal from './SectorModal';

function SectorList(props) {

    const { select } = props;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const [sectors, setSectors] = React.useState([]);
    const [sector, setSector] = React.useState(false);

    React.useEffect(() => {

        if (select) {

            setLoading(true);

            axios.post('admin/getCallcenterSectors', { id: select }).then(({ data }) => {
                setError(null);
                setSectors(data.sectors || []);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [select]);

    return <div className="admin-content-segment w-100">

        <div className="divider-header">

            <h3>Секторы</h3>

            <div>
                <Button
                    icon="plus"
                    circular
                    basic
                    color={error ? "red" : "green"}
                    size="mini"
                    title="Создать сектор в колл-центр"
                    disabled={(!select ? true : false) || (error ? true : false)}
                    onClick={() => setSector(true)}
                />
            </div>

            {sector && <SectorModal
                callcenter={select}
                sector={sector}
                setOpen={setSector}
                setSectors={setSectors}
            />}

        </div>

        {loading
            ? <div className="text-center my-3">
                <Loader active inline />
            </div>
            : select
                ? sectors.length
                    ? sectors.map(sector => {

                        let className = ['callcenter-select-row'];

                        return <div
                            key={sector.id}
                            className={className.join(" ")}
                            onClick={() => setSector(sector.id)}
                        >
                            <div>
                                {sector.name}
                                {sector.comment && <div><small className="opacity-50">{sector.comment}</small></div>}
                            </div>
                        </div>
                    })
                    : <div className="mt-4 mb-3 text-center text-muted">
                        {error
                            ? <small className="text-danger">{error}</small>
                            : <small>Создайте сектор для колл-центра</small>
                        }
                    </div>
                : <div className="mt-4 mb-3 text-center text-muted">
                    <small>Выберите колл-центр</small>
                </div>
        }

    </div>

}

export default SectorList;