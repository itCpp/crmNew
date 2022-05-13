import React from "react";
import axios from "./../../../utils/axios-header";
import { Button, Icon, Loader } from "semantic-ui-react";
import SectorModal from "./SectorModal";

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

        {loading && <div className="text-center my-3"><Loader active inline /></div>}

        {!loading && !select && <div className="mt-4 mb-3 text-center text-muted">
            <small>Выберите колл-центр</small>
        </div>}

        {!loading && select && sectors.length === 0 && <div className="mt-4 mb-3 text-center text-muted">
            {error
                ? <small className="text-danger">{error}</small>
                : <small>Создайте сектор для колл-центра</small>
            }
        </div>}

        {!loading && select && sectors.length > 0 && sectors.map(sector => {

            let className = ['callcenter-sector-row d-flex justify-content-between align-items-center px-3 py-2 my-1'];

            return <div
                key={sector.id}
                className={className.join(" ")}
            >
                <div className="flex-grow-1 p-0">
                    <strong>{sector.name}</strong>
                    {sector.comment && <div><small className="opacity-50">{sector.comment}</small></div>}
                </div>

                <span className="p-0">
                    <Icon
                        name="power"
                        color={sector.active === 1 ? "green" : null}
                        title={sector.active === 1 ? "Включен в работу" : "Деактивирован"}
                        disabled={sector.active !== 1}
                    />
                    <Icon
                        name="code branch"
                        title="Выбрать источники для автоматического назначения новой заявке сектора"
                        color={sector.sources > 0 ? "green" : null}
                        link
                    />
                    <Icon
                        name="pencil"
                        title="Редактировать"
                        onClick={() => setSector(sector.id)}
                        link
                        fitted
                    />
                </span>

            </div>
        })}

    </div>

}

export default SectorList;