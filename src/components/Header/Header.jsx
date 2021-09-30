import React from "react";
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Icon } from 'semantic-ui-react';

import ButtonHeader from "./ButtonHeader";

import './header.css';

function Header(props) {

    const { user, permits } = props;
    const [mode, setMode] = React.useState(localStorage.getItem('god-mode-id'));

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

                {permits.admin_access
                    ? <NavLink to="/admin" title="Админ-панель" className="header-nav-btn">
                        <ButtonHeader
                            icon="setting"
                        />
                    </NavLink>
                    : null
                }

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

                <strong>{user.pin}{user.old_pin ? ` (${user.old_pin})` : ' '}</strong>
                <span>{user.name_fio}</span>

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
    permits: state.main.userPermits,
});

export default connect(mapStateToProps)(Header);