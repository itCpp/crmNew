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
    const { setBlock, blockLoad } = props;
    const { setRoles } = props;
    const { permits, setGodMode } = props;

    if (search) {
        user.login = <ReplaceRow string={user.login} search={search} />
        user.pin = <ReplaceRow string={user.pin} search={search} />
        user.name_full = <ReplaceRow string={user.name_full} search={search} />
    }

    return <div className="users-item">

        <div className="d-flex align-items-center justify-content-between user-item-header mb-2">
            <div className="d-flex align-items-center">
                <div className="user-pin">{user.pin}</div>
                <div className="user-full-name">{user.name_full}</div>
            </div>
            <div>{user.login}</div>
        </div>

        {user.roles.length
            ? <div><strong>Входит в группы:</strong>{' '}{user.roles.map(role => <span key={role} className="role-name">{role}</span>)}</div>
            : null
        }

        {user.callcenter || user.sector
            ? <div>
                {user.callcenter ? <span style={{ marginRight: "1rem" }}><strong>Колл-центр:</strong>{' '}{user.callcenter}</span> : null}
                {user.sector ? <span className="mr-2"><strong>Сектор:</strong>{' '}{user.sector}</span> : null}
            </div>
            : null
        }

        <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="cell-icons">
                <Button
                    icon="edit"
                    primary
                    onClick={() => {
                        props.setUser(user);
                        props.history.replace(`/admin/users?id=${user.id}`);
                    }}
                    size="mini"
                    basic
                />
                <Button
                    icon={user.deleted_at ? "lock" : "unlock"}
                    title={user.deleted_at ? "Разблокировать" : "Заблокировать"}
                    color={user.deleted_at ? "red" : "green"}
                    onClick={() => {
                        setBlock(user.id);
                    }}
                    loading={blockLoad === user.id ? true : false}
                    size="mini"
                    basic={user.deleted_at ? false : true}
                />
                <Button
                    icon="list"
                    color="instagram"
                    title="Роли и разрешения пользователя"
                    onClick={() => {
                        setRoles(user);
                    }}
                    size="mini"
                    basic
                />
                {permits.god_mode
                    ? <Button
                        icon="user secret"
                        color="orange"
                        title="God mode"
                        onClick={() => setGodMode(user.id)}
                        size="mini"
                        basic
                    />
                    : null
                }
            </div>
            <div><small>Создан {user.date}</small></div>
        </div>

    </div>

})