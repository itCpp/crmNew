import React from 'react'
import axios from './../../utils/axios'

import { Dropdown, Icon, Placeholder } from 'semantic-ui-react'

function MangoBalance(props) {

    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {

        if (load) {
            axios.post("https://4company.ru/api/getMangoBalance").then(({ data }) => {
                setOptions(data);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoad(false);
            });
        }

    }, [load]);

    if (!props.access)
        return null;

    const trigger = (
        <Icon name="money bill alternate outline" className="for-hover for-hover-opacity" title="Баланс Манго" onClick={() => load ? null : setLoad(true)} />
    )

    const items = error
        ? <Dropdown.Item className="text-danger" text={error} />
        : options.length
            ? options.map((row, i) => <Dropdown.Item key={i} description={row.office} text={row.balance} />)
            : <div className="mb-3 px-3" style={{ width: "170px" }}>
                <Placeholder>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder>
            </div>

    return <Dropdown
        trigger={trigger}
        pointing='top right'
        icon={null}
        error={error ? true : false}
        onClose={() => {
            setOptions([]);
            setError(false);
        }}
    >
        <Dropdown.Menu>
            <Dropdown.Header content="Баланс Манго" />
            <Dropdown.Divider />
            {items}
        </Dropdown.Menu>
    </Dropdown>

}

export default MangoBalance;