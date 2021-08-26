import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import './header.css'

import MangoBalance from './MangoBalance'

function Header(props) {

    console.log(props);

    return <div className="header-menu border-bottom" id="header-menu">

        <div className="d-flex justify-content-between align-items-center">

            <div>
                <b>CRM MKA</b>

                <NavLink exact to="/" className="header-menu-link">AdCenter</NavLink>
                <NavLink to="/gates" className="header-menu-link">Шлюзы</NavLink>
                <NavLink to="/users" className="header-menu-link">Сотрудники</NavLink>

            </div>

            <div>

                <MangoBalance access={window.access?.admin_show_mango_balance || null} />

            </div>

        </div>


    </div>

}

const mapStateToProps = state => ({
    user: state.main.userData,
});

export default connect(mapStateToProps)(Header);