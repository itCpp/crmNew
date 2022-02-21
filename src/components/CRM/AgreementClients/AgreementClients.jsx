import React from "react";
import { Message, Loader, Dropdown } from "semantic-ui-react";
import { axios } from "../../../utils";
import AgreementsTable from "./AgreementsTable";
import AgreemetnsSearchFrom from "./AgreemetnsSearchFrom";
import "./agreements.css";

const AgreementClients = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [load, setLoad] = React.useState(false);
    const [type, setType] = React.useState(localStorage.getItem('agreements_type') || "neobr");
    const [data, setData] = React.useState({
        rows: [],
    });
    const [search, setSearch] = React.useState(null);

    const getAgreementsRows = params => {

        setLoad(true);

        let formdata = {...(params || {})};
        formdata.type = formdata.search ? "search" : type;

        axios.post('agreements', formdata).then(({ data }) => {
            setData(data);
            error && setError(null);
            window.scrollTo(0, 0);
        }).catch(e => {
            axios.toast(e);
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }

    React.useEffect(() => {
        setLoading(true);
        getAgreementsRows({ page: 1 });
    }, [type]);

    React.useEffect(() => {
        if (search) {
            getAgreementsRows({ page: 1, search });
        } else if (search === false) {
            getAgreementsRows({ page: 1 });
        }
    }, [search]);

    return <div className="pb-3 px-2 w-100">

        <div className="d-flex justify-content-between align-items-center">

            <div className="page-title-box flex-grow-1">
                <h4 className="page-title">Договоры</h4>
            </div>

            {/* {loading && <Loader active inline />} */}

            <AgreemetnsSearchFrom
                loading={loading}
                load={load}
                search={search}
                setSearch={setSearch}
            />

            <Dropdown
                options={[
                    { key: 1, value: "neobr", text: "Необработан" },
                    { key: 2, value: "good", text: "Клиент доволен" },
                    { key: 3, value: "check", text: "Отправлен на проверку" },
                    { key: 4, value: "bad", text: "Негатив" },
                    { key: 5, value: "nocall", text: "Отказ от созвона" },
                    { key: 6, value: "return", text: "Возврат по договору" },
                    { key: 7, value: "all", text: "Все договора" },
                ]}
                direction="left"
                selection
                style={{ minWidth: 220 }}
                loading={loading}
                disabled={loading || load || (search ? true : false)}
                value={type}
                onChange={(e, { value }) => {
                    localStorage.setItem('agreements_type', value);
                    setType(value);
                }}
            />

        </div>

        {!loading && error && <Message error content={error} className="mt-0" />}

        {!loading && !error && <AgreementsTable
            {...data}
            loading={load}
            search={search}
            setData={setData}
            getAgreementsRows={getAgreementsRows}
        />}

        {load && !loading && (data.rows || []).length > 0 && <div style={{ position: "fixed", right: 10, bottom: 10 }}>
            <Loader active inline />
        </div>}

    </div>

}

export default AgreementClients;