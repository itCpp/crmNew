import React from 'react';
import axios from './../../../../utils/axios-header';

import { Loader, Table, Header, Button, Icon } from 'semantic-ui-react';

import AddPermit from './AddPermit';

function Permits() {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [permits, setPermits] = React.useState([]);

    const [showAdd, setShowAdd] = React.useState(false);

    React.useEffect(() => {

        axios.post('dev/getAllPermits').then(({ data }) => {
            setError(false);
            setPermits(data.permits);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const addedPermit = (permit, edit = false) => {

        setPermits([ permit, ...permits]);

    }

    if (loading)
        return <div className="text-center mt-4"><Loader inline active /></div>

    if (error)
        return <div className="text-danger text-center mt-4"><strong>{error}</strong></div>

    const tbody = permits.map((permit, i) => <Table.Row key={i} positive={permit.new || false}>
        <Table.Cell><b>{permit.permission}</b></Table.Cell>
        <Table.Cell>{permit.comment}</Table.Cell>
        <Table.Cell></Table.Cell>
    </Table.Row>);

    return <div>

        <AddPermit
            open={showAdd}
            setOpen={setShowAdd}
            addedPermit={addedPermit}
        />

        <Header
            as="h2"
            content="Права"
            subheader="Добавление или удаление разрешений"
        />

        <Table collapsing>

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Permission</Table.HeaderCell>
                    <Table.HeaderCell>Описание</Table.HeaderCell>
                    <Table.HeaderCell>
                        <Button
                            icon="plus"
                            size="tiny"
                            color="green"
                            title="Создать новое правило"
                            onClick={() => setShowAdd(true)}
                        />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>{tbody}</Table.Body>

        </Table>
    </div>

}

export default Permits;