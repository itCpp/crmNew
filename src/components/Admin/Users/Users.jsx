import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from './../../../utils/axios-header';

import { Header, Button, Input, Message } from 'semantic-ui-react';

import './users.css';
import User from './User';
import UserRow from './UserRow';
import UserRoles from './UserRoles';

function Users(props) {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [searchTimeOut, setSearchTimeOut] = React.useState(null);

    const [load, setLoad] = React.useState(true);
    const [users, setUsers] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const [search, setSearch] = React.useState("");

    const [block, setBlock] = React.useState(null);
    const [blockLoad, setBlockLoad] = React.useState(null);
    const [rolesSetting, setRolesSetting] = React.useState(null);

    const getUsers = (force = false) => {

        // if (search === "" && !force)
        //     return false;

        setLoading(true);

        axios.post('admin/getUsers', { search }).then(({ data }) => {
            setUsers(data.users);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }

    React.useEffect(() => getUsers(true), []);

    React.useEffect(() => {

        if (searchTimeOut)
            clearTimeout(searchTimeOut);

        if (!loading) {
            setSearchTimeOut(setTimeout(() => {
                getUsers();
            }, 300));
        }

    }, [search]);

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

    const list = users.length
        ? users.map(row => <UserRow
            key={row.id}
            user={row}
            setUser={setUser}
            setBlock={setBlock}
            blockLoad={blockLoad}
            search={search}
            setRoles={setRolesSetting}
        />)
        : search && !loading
            ? <Message visible>Ничего не найдено</Message>
            : null

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

        {rolesSetting
            ? <UserRoles
                user={rolesSetting}
                setOpen={setRolesSetting}
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

        <div className="text-center mt-3">
            <Input
                icon={loading ? null : {
                    name: 'search',
                    link: true,
                    onClick: () => getUsers(true),
                }}
                placeholder='Поиск сотрудника...'
                className="mx-auto input-loading"
                loading={loading}
                value={search}
                onChange={e => setSearch(e.currentTarget.value || "")}
                onKeyUp={e => {
                    if (e.keyCode === 13) {
                        clearTimeout(searchTimeOut);
                        getUsers(true);
                    }
                }}
            />
        </div>

        {list}

    </div>

}

export default withRouter(Users)