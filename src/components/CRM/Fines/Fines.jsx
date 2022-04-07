import React from "react";
import { useDispatch } from "react-redux";
import { Button, Input, Loader, Message } from "semantic-ui-react";
import { setShowFineAdd } from "../../../store/requests/actions";
import { axios } from "../../../utils";
import FineAdd from "./FineAdd";
import FineRow from "./FineRow";

const Fines = props => {

    const dispatch = useDispatch();

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [search, setSearch] = React.useState("");

    const getRows = React.useCallback((params = {}) => {

        setLoad(true);

        axios.post('fines/index', params).then(({ data }) => {
            setError(null);
            setRows(data.rows);
        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }, []);

    const startSearch = () => {
        getRows({ page: 1, search });
    }

    React.useEffect(() => {
        getRows();
    }, []);

    return <div className="pb-3 px-2 w-100" style={{ maxWidth: "700px" }}>

        <FineAdd />

        <div className="d-flex justify-content-between align-items-center">

            <div className="page-title-box">
                <h4 className="page-title">Штрафы</h4>
            </div>

            <div className="d-flex align-items-center">

                <Button
                    icon="plus"
                    basic
                    title="Добавить новый штраф"
                    disabled={loading}
                    onClick={() => dispatch(setShowFineAdd(true))}
                />

                <Input
                    placeholder="Поиск..."
                    icon={{
                        name: "search",
                        link: true,
                        onClick: () => startSearch(),
                    }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyUp={e => e.keyCode === 13 ? startSearch() : null}
                    loading={search !== "" && load}
                    disabled={load}
                />
            </div>

        </div>

        {!loading && error && <Message
            error
            content={error}
            className="m-0"
        />}

        {loading && <Loader inline="centered" className="mt-4" />}

        {!loading && rows && rows.length === 0 && <div className="opacity-50 text-center my-4">
            <strong>{search !== "" ? "Ничего не найдено..." : "Данных нет..."}</strong>
        </div>}

        {!loading && rows && rows.length > 0 && rows.map(row => <FineRow
            key={row.id}
            row={row}
            setRows={setRows}
            load={load}
        />)}

    </div>
}

export default Fines;