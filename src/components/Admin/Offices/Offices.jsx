import React from "react";
import axios from "./../../../utils/axios-header";

import { Button, Header, Loader, Message } from "semantic-ui-react";

import OfficesList from "./OfficesList";
import OfficeData from "./OfficeData";

const Offices = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [offices, setOffices] = React.useState([]);
    const [office, setOffice] = React.useState(null);

    React.useEffect(() => {

        setLoading(true);
        setError(false);

        axios.post('dev/getOffices').then(({ data }) => {
            setOffices(data.offices);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="segment-compact">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Адреса и офисы"
                subheader="Настройка офисов и адресов для записей"
            />

            {loading && <Loader active inline />}

            {!loading && <Button
                icon="plus"
                circular
                basic
                color="green"
                onClick={() => setOffice(true)}
                disabled={Boolean(office)}
            />}

        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !office && <OfficesList
            offices={offices}
            office={office}
            setOffice={setOffice}
        />}

        {!loading && office && <OfficeData
            office={office}
            setOffice={setOffice}
            setOffices={setOffices}
        />}

    </div>

}

export default Offices;