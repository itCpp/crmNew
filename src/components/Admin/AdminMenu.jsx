import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { setSubMenuPoints } from './../../store/admin/actions';

import { NavLink } from 'react-router-dom';

import { Icon } from 'semantic-ui-react';

function AdminMenu(props) {

    const { permits, subMenuPoints, setSubMenuPoints } = props;

    return <div className="admin-menu">

        {permits.block_dev
            ? <div className="admin-menu-block">

                <h5>Настройки</h5>

                <NavLink to="/admin/permits" className="admin-menu-point" onClick={() => setSubMenuPoints(null)}>
                    <Icon name="angle right" />
                    <span>Permissions</span>
                </NavLink>

                <NavLink to="/admin/roles" className="admin-menu-point" onClick={() => setSubMenuPoints(null)}>
                    <Icon name="angle right" />
                    <span>Roles</span>
                </NavLink>

                <NavLink to="/admin/callcenters" className="admin-menu-point" onClick={() => setSubMenuPoints(null)}>
                    <Icon name="sound" />
                    <span>Колл-центры</span>
                </NavLink>

                <NavLink to="/admin/sources" className="admin-menu-point" onClick={() => setSubMenuPoints(null)}>
                    <Icon name="fork" />
                    <span>Источники</span>
                </NavLink>

            </div>
            : null
        }

        {permits.block_dev
            ? <div className="admin-menu-block">

                <h5>Сотрудники</h5>

                <NavLink to="/admin/users" className="admin-menu-point" onClick={() => setSubMenuPoints(null)}>
                    <Icon name="user" />
                    <span>Учетные записи</span>
                </NavLink>

                {/* <NavLink to="/admin/permits" className="admin-menu-point" onClick={() => setSubMenuPoints(null)}>
                    <Icon name="angle right" />
                    <span>Сессии</span>
                </NavLink> */}

            </div>
            : null
        }

    </div>

}

const mapStateToProps = state => ({
    subMenuPoints: state.admin.subMenuPoints,
})

const mapDispatchToProps = {
    setSubMenuPoints
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminMenu));