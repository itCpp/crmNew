import React from "react";
import axios from "./../../utils/axios-header";
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    setAuthQueriesCount,
    changeAuthQueriesCount,
    setLogin,
    setUserData,
    setUserPermits,
    setUserWorkTime
} from "./../../store/actions";

import { Icon, Dropdown, Dimmer, Loader } from 'semantic-ui-react';

import ButtonHeader from "./ButtonHeader";
import AuthQueries from "./../Auth/AuthQueries";
import ActiveStatusUser from "./ActiveStatusUser";

import './header.css';

function Header(props) {

    const { user, permits } = props;
    const { setLogin, setUserData, setUserPermits } = props;
    const [mode, setMode] = React.useState(localStorage.getItem('god-mode-id'));

    const [logout, setLogout] = React.useState(false);

    React.useEffect(() => {

        if (logout) {
            axios.post('logout').then(() => {
                setLogin(false);
                setUserData({});
                setUserPermits({});
            }).catch(error => {
                setLogout(false);
                axios.toast(error)
            });
        }

    }, [logout]);

    const godModeOff = () => {
        setMode(true);
        localStorage.removeItem('god-mode-id');
        window.location.reload();
    }

    return <div className="header-menu" id="header-menu">

        <div className="d-flex justify-content-between align-items-center h-100">

            <div className="d-flex align-items-center">

                <NavLink exact to="/" title="Главная страница" className="header-title">CRM MKA</NavLink>

            </div>

            <div className="header-rows">

                {permits.user_auth_query
                    ? <AuthQueries {...props} />
                    : null
                }

                {permits.admin_access
                    ? <NavLink to="/admin" title="Админ-панель" className="header-nav-btn">
                        <ButtonHeader
                            icon="setting"
                        />
                    </NavLink>
                    : null
                }

                <ActiveStatusUser {...props} />

                {mode ?
                    <span>
                        <Icon
                            name="secret user"
                            className="text-primary"
                            title="Имитация пользователя"
                        />
                    </span>
                    : null
                }

                <div className="position-relative">

                    <strong>{user.pin}{user.old_pin ? ` (${user.old_pin})` : ' '}</strong>

                    <Dropdown text={user.name_fio} className="mt-1 header-hover-text" pointing="top right" direction="left">
                        <Dropdown.Menu>
                            <Dropdown.Item
                                icon="user"
                                text="Мои данные"
                                disabled={true}
                            />
                            <Dropdown.Divider className="my-0" />
                            <Dropdown.Item
                                icon="log out"
                                text="Выход"
                                disabled={logout}
                                onClick={() => setLogout(true)}
                            />
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dimmer active={logout} inverted>
                        <Loader inverted size="small" />
                    </Dimmer>

                </div>

                {mode ?
                    <ButtonHeader
                        icon="close"
                        className="btn-header-danger"
                        title="Отключить имитацию пользователя"
                        onClick={godModeOff}
                        loading={mode === true ? true : false}
                    />
                    : null
                }

            </div>

        </div>


    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    worktime: state.main.worktime,
    permits: state.main.userPermits,
    count: state.main.authQueries
});

const mapActions = {
    changeAuthQueriesCount,
    setAuthQueriesCount,
    setLogin,
    setUserData,
    setUserPermits,
    setUserWorkTime
}

export default connect(mapStateToProps, mapActions)(Header);