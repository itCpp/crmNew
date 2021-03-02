import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from './../../../utils/axios'

import { Input, Segment, Message } from 'semantic-ui-react'

import './users.css'
import UserRow from './UserRow'
import UserPage from './UserPage'

function Users() {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [user, setUser] = React.useState(null);

    const [search, setSearch] = React.useState("");
    const [searchTimeOut, setSearchTimeOut] = React.useState(null);

    const getUsers = (force = false) => {

        if (search === "" && !force)
            return false;

        setLoading(true);

        axios.post('admin/userSearch', { word: search }).then(({ data }) => {
            setUsers(data.users);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }

    React.useEffect(() => {

        if (user === false)
            getUsers();

    }, [user])

    React.useEffect(() => {

        if (searchTimeOut)
            clearTimeout(searchTimeOut);

        if (!loading) {
            setSearchTimeOut(setTimeout(() => {
                getUsers();
            }, 300));
        }

    }, [search]);

    if (user)
        return <UserPage user={user} setUser={setUser} />

    const list = users.length
        ? <Segment loading={loading} className="content-users-items" style={{ boxShadow: "none" }}>
            {users.map(user => <UserRow key={user.id} user={user} search={search} setUser={setUser} />)}
        </Segment>
        : search && !loading
            ? <Message visible>Ничего не найдено</Message>
            : <Message visible>Введите в поле поиска пин, фамилию, имя, отчество или номер телефона сотрудника</Message>

    return <div className="content py-3">

        <div className="text-center">
            <Input
                icon={loading ? null : {
                    name: 'search',
                    circular: true,
                    link: true,
                    inverted: true,
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

        <div className="input-loading mx-auto mt-3">{list}</div>

    </div>

}

export default withRouter(Users)