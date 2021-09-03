import React from 'react';
import axios from './../../../../utils/axios-header';

import { Loader, Table, Header, Button, Icon, Message } from 'semantic-ui-react';

import AddPermit from './AddPermit';

function Permits() {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [permits, setPermits] = React.useState([]);

    const [showAdd, setShowAdd] = React.useState(false);
    const [edit, setEdit] = React.useState(null);

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

        if (edit) {

            for (let i in permits)
                if (permits[i].permission === permit.permission)
                    permits[i] = permit;

            return setPermits(permits);

        }

        setPermits([permit, ...permits]);

    }

    React.useEffect(() => {

        if (!showAdd)
            setEdit(null);

    }, [showAdd]);

    React.useEffect(() => {

        if (edit)
            setShowAdd(true);

    }, [edit]);

    const tbody = permits.map((permit, i) => <Table.Row key={i} positive={permit.new || false}>
        <Table.Cell><b>{permit.permission}</b></Table.Cell>
        <Table.Cell>{permit.comment}</Table.Cell>
        <Table.Cell textAlign="center" className="cell-icons">
            <Icon name="edit outline" color="blue" className="button-icon" onClick={() => setEdit(permit)} />
            {/* <Icon name="trash" color="red" className="button-icon" /> */}
            {/* <Icon name="search" className="button-icon" /> */}
        </Table.Cell>
    </Table.Row>);

    return <div>

        <AddPermit
            open={showAdd}
            setOpen={setShowAdd}
            addedPermit={addedPermit}
            edit={edit}
        />

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Разрешения"
                subheader="Добавление или удаление разрешений пользотеля или роли для использования в коде API сервера"
            />

            {loading ? <Loader active inline /> : null}

        </div>

        {error
            ? <Message
                error
                header="Ошибка"
                list={[error]}
            />
            : null
        }

        {!error && !loading
            ? <div className="admin-content-segment d-inline-block">

                <Table collapsing basic="very" className="my-3" compact>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Permission</Table.HeaderCell>
                            <Table.HeaderCell>Описание</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">
                                <Button
                                    icon="plus"
                                    size="mini"
                                    color="green"
                                    title="Создать новое правило"
                                    onClick={() => setShowAdd(true)}
                                    circular
                                    basic
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>{tbody}</Table.Body>

                </Table>

            </div>
            : null
        }
    </div>

}

export default Permits;