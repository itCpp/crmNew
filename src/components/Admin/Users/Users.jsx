import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from './../../../utils/axios-header';

import { Header, Button, Input, Segment, Message } from 'semantic-ui-react';

import './users.css';
import User from './User';
import UserRow from './UserRow';

function Users(props) {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const [load, setLoad] = React.useState(true);
    const [users, setUsers] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const [search, setSearch] = React.useState("");

    const [block, setBlock] = React.useState(null);
    const [blockLoad, setBlockLoad] = React.useState(null);

    const getUsers = (force = false) => {

        if (search === "" && !force)
            return false;

        setLoading(true);

        axios.post('admin/getUsers', { word: search }).then(({ data }) => {
            setUsers(data.users);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }

    React.useEffect(() => getUsers(true), []);

    React.useEffect(() => {

        if (!user) {
            props.history.replace(`/admin/users`);
        }

    }, [user]);

    React.useEffect(() => {

        if (block) {

            setBlockLoad(block);

            axios.post('admin/blockUser', { id: block }).then(({ data }) => {

                setBlockLoad(null);

                let list = [...users];

                list.forEach((row, i) => {
                    if (row.id === data.id)
                        list[i].deleted_at = data.deleted_at;
                });

                setUsers(list);

            }).catch(() => {
                setBlockLoad(null);
            });

        }

        return () => setBlock(null);

    }, [block]);

    const list = users.map(row => <UserRow
        key={row.id}
        user={row}
        setUser={setUser}
        setBlock={setBlock}
        blockLoad={blockLoad}
    />);

    return <div style={{ maxWidth: "800px" }}>

        {user
            ? <User
                user={user}
                setUser={setUser}
                users={users}
                setUsers={setUsers}
            />
            : null
        }

        <div className="d-flex align-items-center justify-content-between">

            <Header
                as="h2"
                content="Сотрудники"
                className="mb-0"
            />

            <Button
                // labelPosition="right"
                icon="plus"
                // content="Добавить сотрудника"
                title="Добавить сотрудника"
                color="green"
                onClick={() => setUser({ new: true })}
                style={{ marginRight: "0" }}
            />

        </div>

        {list}

    </div>

}

export default withRouter(Users)