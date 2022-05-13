import React from "react";
import { Checkbox, Dimmer, Header, Loader, Message, Modal } from "semantic-ui-react";
import { axios } from "../../../utils";

const SectorSelectSourceModel = props => {

    const { close, sector, setSectors } = props;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [row, setRow] = React.useState({});
    const [selecteds, setSelecteds] = React.useState([]);
    const [sources, setSources] = React.useState([]);

    React.useEffect(() => {

        if (sector) {

            setLoading(true);

            axios.post('admin/getSector', {
                sector,
                getSources: true,
            }).then(({ data }) => {
                setRow(data.sector);
                setSelecteds(data.sector.source_selects);
                setSources(data.sources);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [sector]);

    return <Modal
        open={sector ? true : false}
        onClose={close}
        header={<Header
            content="Выбор источников"
            subheader="По выбранным источникам новые заявки будут автоматически назначены этому сектору"
        />}
        size="tiny"
        centered={false}
        content={< div className="py-3 px-3 position-relative" >

            {loading && <div className="text-center my-3">Загрузка...</div>}

            {!loading && error && <Message error content={error} />}

            {!loading && sources.length > 0 && sources.map(source => <SourceRow
                key={source.id}
                sector={row.id}
                row={source}
                checked={selecteds.indexOf(source.id) >= 0}
                setSelecteds={setSelecteds}
                {...props}
            />)}

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

        </div >}
    />
}

const SourceRow = props => {

    const { row, sector, checked, setSelecteds, setSectors } = props;
    const [loading, setLoading] = React.useState(false);

    const setSelect = checked => {

        setLoading(true);

        axios.post('admin/setAutoSector', {
            id: row.id,
            sector,
            checked
        }).then(() => {
            setSelecteds(prev => {

                let rows = [];

                if (checked) {
                    rows = [...prev];

                    if (prev.indexOf(row.id) < 0)
                        rows.push(row.id);
                } else if (!checked) {
                    prev.forEach(item => {
                        if (item !== row.id) {
                            rows.push(item);
                        }
                    });
                }

                setSectors(prev => {

                    prev.forEach((s, i) => {
                        if (s.id === sector) {
                            prev[i].sources = rows.length;
                        }
                    });

                    return prev;
                });

                return rows;
            });
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        })

    }

    return <div className="my-1 px-2 py-1 d-flex align-items-center callcenter-sector-row">
        <div className="flex-grow-1" title={row.comment}>{row.name}</div>
        <div>
            <Checkbox
                className="mt-1"
                checked={checked}
                onChange={(e, { checked }) => setSelect(checked)}
                disabled={loading}
            />
        </div>
    </div>
}

export default SectorSelectSourceModel;