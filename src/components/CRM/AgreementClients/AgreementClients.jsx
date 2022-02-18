import React from "react";
import { Loader } from "semantic-ui-react";
import { axios } from "../../../utils";
import AgreementsTable from "./AgreementsTable";

const AgreementClients = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState({});

    const getAgreementsRows = params => {

        axios.post('agreements', { ...(params || {}), type: "neobr" }).then(({ data }) => {
            setData(data);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }

    React.useEffect(() => {

        getAgreementsRows({ page: 1 });

    }, []);

    return <div className="pb-3 px-2 w-100">

        <div className="d-flex justify-content-between align-items-center">

            <div className="page-title-box flex-grow-1">
                <h4 className="page-title">Договоры</h4>
            </div>

            {loading && <Loader active inline />}

        </div>

        {!loading && <AgreementsTable {...data} />}

    </div>

}

export default AgreementClients;