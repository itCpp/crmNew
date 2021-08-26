import React from 'react';
import axios from './../../../../utils/axios-header';
import { Loader, Message, Table, Icon, Button } from 'semantic-ui-react';

import ChecksModal from './ChecksModal';

function Gates() {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [show, setShow] = React.useState(null);

    React.useEffect(() => {

        axios.post('/gates/getChecksList').then(({ data }) => {
            setRows(data.rows);
            setError(false);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const body = rows.length
        ? rows.map(row => <Table.Row key={row.id} positive={row.process}>
            <Table.Cell className="text-center">{row.id}</Table.Cell>
            <Table.Cell>{row.fusion_extension}</Table.Cell>
            <Table.Cell>
                <span>{row.gate_extension}</span>
                {row.ip ? <i>{' '}({row.ip})</i> : null}
            </Table.Cell>
            <Table.Cell>{row.phone}</Table.Cell>
            <Table.Cell>{row.pin}</Table.Cell>
            <Table.Cell>{row.date}</Table.Cell>
            <Table.Cell>{row.comment}</Table.Cell>
            <Table.Cell className="text-center p-1">
                <Button size="mini" icon style={{ margin: "0" }} onClick={() => setShow(row.id)}>
                    <Icon name="edit" />
                </Button>
            </Table.Cell>
        </Table.Row>)
        : <Table.Row disabled>
            <Table.Cell colSpan="8" className="text-center">Добавьте настройку</Table.Cell>
        </Table.Row>

    if (loading)
        return <Loader active inline="centered" indeterminate size="small" className="mt-3" />

    if (error)
        return <Message negative className="gates-error">{error}</Message>

    return <div>

        <ChecksModal
            show={show}
            setShow={setShow}
        />

        <Table compact celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell className="text-center">#</Table.HeaderCell>
                    <Table.HeaderCell>Fusion extension</Table.HeaderCell>
                    <Table.HeaderCell>Gate extension</Table.HeaderCell>
                    <Table.HeaderCell>Phone source</Table.HeaderCell>
                    <Table.HeaderCell>Pin</Table.HeaderCell>
                    <Table.HeaderCell>Start date</Table.HeaderCell>
                    <Table.HeaderCell>Comment</Table.HeaderCell>
                    <Table.HeaderCell className="text-center p-1">
                        <Button color="green" size="mini" icon style={{ margin: "0" }} onClick={() => setShow(true)}>
                            <Icon name="plus" />
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>{body}</Table.Body>
        </Table>

    </div>

}

export default Gates;