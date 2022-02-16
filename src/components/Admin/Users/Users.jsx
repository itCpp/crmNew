import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from './../../../utils/axios-header';
import { connect } from 'react-redux';
import { Header, Button, Input, Message, Grid } from 'semantic-ui-react';
import './users.css';
import User from './User';
import UserRow from './UserRowCard';
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

    // React.useEffect(() => getUsers(true), []);

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

    const setGodMode = id => {
        localStorage.setItem('god-mode-id', id);
        window.location.href = "/";
    }

    const list = users.length > 0 && users.map(row => <UserRow
        {...props}
        key={row.id}
        user={row}
        setUser={setUser}
        setBlock={setBlock}
        blockLoad={blockLoad}
        search={search}
        setRoles={setRolesSetting}
        setGodMode={setGodMode}
    />);

    return <div>

        {user && <User
            user={user}
            setUser={setUser}
            users={users}
            setUsers={setUsers}
        />}

        {rolesSetting && <UserRoles
            user={rolesSetting}
            setOpen={setRolesSetting}
            users={users}
            setUsers={setUsers}
        />}

        <div className="admin-content-segment d-flex align-items-center justify-content-between">
            <Header
                as="h2"
                content="Сотрудники"
                subheader="Управление учетными записями ЦРМ"
                className="mb-0 flex-grow-1"
            />

            <div className="d-flex align-items-center">

                <Button
                    icon="plus"
                    title="Добавить сотрудника"
                    color="green"
                    onClick={() => setUser({ new: true })}
                    circular
                    basic
                />

                <Input
                    icon={loading ? null : {
                        name: 'search',
                        link: true,
                        onClick: () => getUsers(true),
                    }}
                    placeholder='Поиск сотрудника...'
                    className="ml-3 d-sm-none d-md-block"
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

        </div>

        <div className="admin-content-segment text-center d-none d-sm-block d-md-none">
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

        <Grid columns={3}>{list}</Grid>

        {search && users.length === 0 && <div className="mt-5 text-center text-muted opacity-80"><b>Ничего не найдено</b></div>}

    </div>

}

const mapStore = store => ({
    onlineId: store.main.onlineId,
})

export default withRouter(connect(mapStore)(Users));