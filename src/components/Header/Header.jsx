import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Icon } from 'semantic-ui-react';

import './header.css';

function Header(props) {

    const { user, permits } = props;

    return <div className="header-menu border-bottom" id="header-menu">

        <div className="d-flex justify-content-between align-items-center">

            <div>

                <b className="header-title">CRM MKA</b>

                <NavLink exact to="/" className="header-menu-link text-primary" title="Главная страница">
                    <Icon name="home" className="header-menu-icon" />
                </NavLink>

                {permits.admin_access
                    ? <NavLink to="/admin" className="header-menu-link text-danger" title="Админ-панель">
                        <Icon name="setting" className="header-menu-icon" />
                    </NavLink>
                    : null
                }

            </div>

            <div>

                <strong>{user.pin}{' '}</strong>
                <span>{user.name_fio}</span>

            </div>

        </div>


    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
    permits: state.main.userPermits,
});

export default connect(mapStateToProps)(Header);