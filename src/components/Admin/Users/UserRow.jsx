import React from 'react'
import { withRouter } from 'react-router-dom'

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
   
    const user = props.user;console.log(props)

    user.username = <ReplaceRow string={user.username} search={props.search} />
    user.pin = <ReplaceRow string={user.pin} search={props.search} />
    user.fullName = <ReplaceRow string={user.fullName} search={props.search} />

    return <div className="users-item" onClick={() => {
        props.setUser(user);
        props.history.replace(`/users?id=${user.id}`);
    }}>

        <div className="d-flex align-items-center justify-content-between">
            <div><b>{user.pin}</b>{' '}{user.fullName}</div>
            <small>{user.rights}</small>
        </div>

        <div className="d-flex align-items-center justify-content-between">
            <div>
                <small>{user.username}</small>
                {user.state !== "Работает" ? <small className="text-danger">{' '}<b>Уволен</b></small> : null}
            </div>
            <div><small>Создан {user.date}</small></div>
        </div>

    </div>

})