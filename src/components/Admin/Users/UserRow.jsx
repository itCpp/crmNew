import React from 'react';
import { withRouter } from 'react-router-dom';

import { Button, Icon } from 'semantic-ui-react';

const reactStringReplace = require('react-string-replace');

function ReplaceRow(props) {

    let string = props.string;
    let search = props.search;

    // console.log(React.ElementProps(props))

    return reactStringReplace(string, search, (match, i) => (
        <span key={i} style={{
            background: '#bfffbf',
            borderRadius: '.15rem',
            fontWeight: 700,
        }}>{match}</span>
    ));

}

export default withRouter(function UserRow(props) {

    const { user, search } = props;

    if (search) {
        user.login = <ReplaceRow string={user.login} search={search} />
        user.pin = <ReplaceRow string={user.pin} search={search} />
        user.name_full = <ReplaceRow string={user.name_full} search={search} />
    }

    return <div className="users-item">

        <div className="d-flex align-items-center justify-content-between user-item-header">
            <div className="d-flex align-items-center">
                <div className="user-pin">{user.pin}</div>
                <div className="user-full-name">{user.name_full}</div>
            </div>
            <div>{user.login}</div>
        </div>

        {user.roles.length
            ? <div className="mt-1"><strong>Входит в группы:</strong>{' '}{user.roles.map(role => <span key={role} className="role-name">{role}</span>)}</div>
            : null
        }

        <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="cell-icons">
                <Button.Group size="tiny">
                    <Button
                        icon="edit"
                        primary
                        onClick={() => {
                            props.setUser(user);
                            props.history.replace(`/admin/users?id=${user.id}`);
                        }}
                    />
                </Button.Group>
            </div>
            <div><small>Создан {user.date}</small></div>
        </div>

    </div>

})