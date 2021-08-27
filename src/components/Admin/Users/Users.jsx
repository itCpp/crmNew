import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from './../../../utils/axios';

import { Header, Button, Input, Segment, Message } from 'semantic-ui-react';

import './users.css';
import User from './User';

function Users() {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [user, setUser] = React.useState(null);

    return <div>

        {user
            ? <User
                user={user}
                setUser={setUser}
            />
            : null
        }

        <Header
            as="h2"
            content="Сотрудники"
        />

        <Button
            labelPosition="right"
            icon="plus"
            content="Добавить сотрудника"
            color="green"
            onClick={() => setUser({ new: true })}
        />

    </div>

}

export default withRouter(Users)