import React from "react";
import axios from "./../../utils/axios-header";
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    setAuthQueriesCount,
    changeAuthQueriesCount,
    setLogin,
    setUserData,
    setUserPermits,
    setUserWorkTime,
    // setShowMenu,
} from "./../../store/actions";
import { Icon, Dropdown, Dimmer, Loader } from 'semantic-ui-react';
import ButtonHeader from "./ButtonHeader";
import AuthQueries from "./../Auth/AuthQueries";
import ActiveStatusUser from "./ActiveStatusUser";
import './header.css';
import UserCreate from "./UserCreate";

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

                <span>
                    <Icon
                        name="bars"
                        size="large"
                        link
                        className="ml-1 mr-3 header-menu-button"
                        style={{ marginTop: "3px" }}
                        id="set-show-menu-btn"
                    // onClick={() => props.setShowMenu(!props.showMenu)}
                    />
                </span>

                <NavLink exact to="/" title="Главная страница" className="header-title">CRM MKA</NavLink>

            </div>

            <div className="header-rows">

                {permits.user_create && <UserCreate />}

                {permits.user_auth_query && <AuthQueries {...props} />}

                {permits.admin_access && <NavLink to="/admin" title="Админ-панель" className="header-nav-btn">
                    <ButtonHeader
                        icon="setting"
                    />
                </NavLink>}

                <ActiveStatusUser {...props} />

                {mode && <span className="mt-1">
                    <Icon
                        name="secret user"
                        color="blue"
                        title="Имитация пользователя"
                    />
                </span>}

                <div className="position-relative ml-2">

                    <strong title="Это Ваш персональный идентификационный номер">
                        {user.pin}
                        {(user.old_pin && Number(user.pin) !== Number(user.old_pin)) ? ` (${user.old_pin}) ` : ' '}
                    </strong>

                    <Dropdown text={user.name_fio} className="mt-1 header-hover-text" pointing="top right" direction="left">
                        <Dropdown.Menu>
                            <Dropdown.Item
                                icon="user"
                                text="Мои данные"
                                onClick={() => props.history.push(`/user/${user.id}`)}
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

                    <span className="ml-2 mt-1">
                        <Icon name="briefcase" color={props?.worktime?.color || "grey"} />
                    </span>

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
    count: state.main.authQueries,
    showMenu: state.main.showMenu,
});

const mapActions = {
    changeAuthQueriesCount,
    setAuthQueriesCount,
    setLogin,
    setUserData,
    setUserPermits,
    setUserWorkTime,
    // setShowMenu,
}

export default withRouter(connect(mapStateToProps, mapActions)(Header));