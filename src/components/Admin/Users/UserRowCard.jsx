import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Grid, Header } from 'semantic-ui-react';
import moment from "moment";

const reactStringReplace = require('react-string-replace');

function ReplaceRow(props) {

    let string = props.string;
    let search = props.search;

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
    const created_at = moment(user.created_at).format("DD.MM.YYYY HH:mm");

    const className = ["users-item m-0 h-100"];

    if (user.deleted_at)
        className.push("user-fired");

    if (props.onlineId.indexOf(user.id) >= 0)
        className.push("user-online");

    let login = String(user.login);
    let pin = String(user.pin);
    let name_full = String(user.name_full);
    let old_pin = String(user.old_pin);

    if (search) {
        login = <ReplaceRow string={login} search={search} />
        pin = <ReplaceRow string={pin} search={search} />
        name_full = <ReplaceRow string={name_full} search={search} />
        old_pin = <ReplaceRow string={old_pin} search={search} />
    }

    return <Grid.Column>

        <div className={className.join(" ")}>

            <div className="d-flex flex-column h-100">

                <div className="mb-auto">

                    <div className="d-flex align-items-center position-relative">

                        <Header
                            as="h5"
                            content={<div>{name_full}</div>}
                            subheader={<div className="sub header">
                                <strong>{pin}</strong>
                                {user.old_pin && String(user.old_pin) !== String(user.pin) && <span>{' '}{old_pin}</span>}
                            </div>}
                            className="flex-grow-1 mb-0"
                        />

                        <span>{login}</span>

                        {props.onlineId.indexOf(user.id) >= 0 && <Icon
                            name="circle"
                            title="Онлайн"
                            color="green"
                            size="tiny"
                            style={{
                                position: "absolute",
                                left: "-14px",
                                top: 4,
                            }}
                        />}

                    </div>

                    {user.roles.length > 0 && <div>
                        <strong>Входит в группы:</strong>{' '}{user.roles.map(role => <span key={role} className="role-name">{role}</span>)}
                    </div>}

                    {(user.callcenter || user.sector) && <div>
                        {user.callcenter ? <span style={{ marginRight: "1rem" }}><strong>Колл-центр:</strong>{' '}{user.callcenter}</span> : null}
                        {user.sector ? <span className="mr-2"><strong>Сектор:</strong>{' '}{user.sector}</span> : null}
                    </div>}

                </div>

                <div>

                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="cell-icons">

                            <Button
                                icon="edit"
                                primary
                                onClick={() => {
                                    props.setUser(user.id);
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

                            {permits.god_mode && <Button
                                icon="user secret"
                                color="orange"
                                title="God mode"
                                onClick={() => setGodMode(user.id)}
                                size="mini"
                                basic
                            />}

                        </div>
                        <div><small>Создан {created_at.indexOf(" 00:00") >= 0 ? moment(user.created_at).format("DD.MM.YYYY") : created_at}</small></div>
                    </div>

                </div>

            </div>

        </div>

    </Grid.Column>

});