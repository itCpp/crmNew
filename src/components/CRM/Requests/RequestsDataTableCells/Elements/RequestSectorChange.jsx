import React from "react";
import { useDispatch } from "react-redux";
import axios from "./../../../../../utils/axios-header";
import { updateRequestRow } from "./../../../../../store/requests/actions";
import { Icon, Dropdown, Placeholder, Label } from "semantic-ui-react";

const RequestSectorChange = (props) => {

    const { row } = props;
    const [data, setData] = React.useState(null);
    const [load, setLoad] = React.useState(false);

    const dispatch = useDispatch();

    React.useEffect(async () => {
        if (load) {
            let response = await findSectors({ id: row.id });
            setData(response);
            setLoad(false);
        }

        return () => setLoad(false);
    }, [load]);

    const [change, setChange] = React.useState(false);

    /**
     * Вывод доступных к выбору сектров
     * @returns {object}
     */
    const findSectors = React.useCallback(async formdata => {

        let response = {};

        await axios
            .post("requests/changeSectorShow", formdata)
            .then(({ data }) => {
                response = { ...data, done: true };
            })
            .catch((error) => {
                response = {
                    done: false,
                    error: axios.getError(error),
                };
            });

        return response;
    }, []);

    /**
     * Смена сектора
     * @returns {boolean}
     */
    const changeSector = React.useCallback(async formdata => {

        let response = true;

        await axios
            .post("requests/setSector", formdata)
            .then(({ data }) => {
                dispatch(updateRequestRow(data.request));
            })
            .catch((error) => {
                axios.toast(error, { time: 5000 });
                response = false;
            });

        return response;
    }, []);

    React.useEffect(async () => {
        if (change) {
            await changeSector({ id: row.id, sector: change });
            setChange(false);
        }
    }, [change]);

    if (!row.permits.requests_sector_change) {
        return (
            <div className="mb-1" title="Сектор">
                <Icon name="random" />
                <span>{row?.sector?.name || "???"}</span>
            </div>
        );
    }

    return (
        <div className={`mb-1 ${!row.sector ? "text-danger" : ""}`}>
            <Icon name="random" />
            <Dropdown
                inline
                text={row?.sector?.name || "???"}
                onOpen={() => setLoad(true)}
                onClose={() => setData(null)}
                className="dropdown-change-sector"
                loading={change ? true : false}
            >
                <Dropdown.Menu>

                    <Dropdown.Header className="my-1">Выберите сектор</Dropdown.Header>

                    {data ? (
                        data?.callcenters ? (
                            data?.callcenters.length ? (
                                <>
                                    {data.callcenters.map((callcenter) => (
                                        <Dropdown.Menu
                                            key={callcenter.id}
                                            scrolling
                                        >
                                            <Dropdown.Header className="my-1">
                                                {callcenter.name}
                                            </Dropdown.Header>
                                            {callcenter.sectors &&
                                                callcenter.sectors.length ? (
                                                callcenter.sectors.map(
                                                    (sector) => (
                                                        <Dropdown.Item
                                                            key={sector.id}
                                                            onClick={() =>
                                                                setChange(
                                                                    sector.id
                                                                )
                                                            }
                                                            className="d-flex justify-content-between align-items-center"
                                                        >
                                                            <span className="flex-grow-1">
                                                                {sector.name}
                                                            </span>
                                                            <div className="d-flex align-items-center">
                                                                <Label
                                                                    color="green"
                                                                    horizontal
                                                                    content={`${sector.free || 0}/${sector.online || 0}`}
                                                                    title="Свободные операторы / Всего в системе"
                                                                    size="mini"
                                                                    style={{
                                                                        minWidth:
                                                                            "auto",
                                                                    }}
                                                                />
                                                                <Label
                                                                    color="orange"
                                                                    horizontal
                                                                    title="Количество заявок сегодня"
                                                                    content={
                                                                        sector.requests ||
                                                                        0
                                                                    }
                                                                    size="mini"
                                                                    style={{
                                                                        margin: 0,
                                                                        minWidth:
                                                                            "auto",
                                                                    }}
                                                                />
                                                            </div>
                                                        </Dropdown.Item>
                                                    )
                                                )
                                            ) : (
                                                <div className="mx-1 my-1 error-message text-center">
                                                    <small className="text-muted">
                                                        Секторов нет
                                                    </small>
                                                </div>
                                            )}
                                        </Dropdown.Menu>
                                    ))}
                                </>
                            ) : (
                                <div className="mx-1 my-3 error-message text-center">
                                    <small className="text-muted">
                                        Список пуст
                                    </small>
                                </div>
                            )
                        ) : (
                            <div className="mx-1 my-3 error-message text-center">
                                <small className="text-danger">
                                    {data.error || "Ошибка загрузки секторов"}
                                </small>
                            </div>
                        )
                    ) : (
                        <div className="mx-1 my-3">
                            <Placeholder>
                                <Placeholder.Header>
                                    <Placeholder.Line length="full" />
                                    <Placeholder.Line length="full" />
                                    <Placeholder.Line length="full" />
                                </Placeholder.Header>
                            </Placeholder>
                        </div>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default RequestSectorChange;
