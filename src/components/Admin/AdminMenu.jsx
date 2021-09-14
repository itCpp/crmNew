import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { setSubMenuPoints, setPanelMenuPoints } from './../../store/admin/actions';

import { NavLink } from 'react-router-dom';

import { Icon } from 'semantic-ui-react';

function AdminMenu(props) {

    const { permits, setSubMenuPoints, setPanelMenuPoints } = props;

    const changePage = () => {
        setPanelMenuPoints(null);
        setSubMenuPoints(null);
    }

    return <div className="admin-menu">

        {permits.block_dev
            ? <div className="admin-menu-block">

                <h5>Сотрудники</h5>

                <NavLink to="/admin/users" className="admin-menu-point" onClick={changePage}>
                    <Icon name="user" />
                    <span>Учетные записи</span>
                </NavLink>

                {/* <NavLink to="/admin/permits" className="admin-menu-point" onClick={changePage}>
                    <Icon name="angle right" />
                    <span>Сессии</span>
                </NavLink> */}

            </div>
            : null
        }

        {permits.block_dev
            ? <div className="admin-menu-block">

                <h5>Настройки</h5>

                <NavLink to="/admin/callcenters" className="admin-menu-point" onClick={changePage}>
                    <Icon name="sound" />
                    <span>Колл-центры</span>
                </NavLink>

                <NavLink to="/admin/sources" className="admin-menu-point" onClick={changePage}>
                    <Icon name="fork" />
                    <span>Источники</span>
                </NavLink>

                <NavLink to="/admin/statuses" className="admin-menu-point" onClick={changePage}>
                    <Icon name="angle right" />
                    <span>Статусы</span>
                </NavLink>

                <NavLink to="/admin/tabs" className="admin-menu-point" onClick={changePage}>
                    <Icon name="table" />
                    <span>Вкладки</span>
                </NavLink>

                <NavLink to="/admin/roles" className="admin-menu-point" onClick={changePage}>
                    <Icon name="angle right" />
                    <span>Roles</span>
                </NavLink>

                <NavLink to="/admin/permits" className="admin-menu-point" onClick={changePage}>
                    <Icon name="angle right" />
                    <span>Permissions</span>
                </NavLink>

            </div>
            : null
        }

    </div>

}

const mapStateToProps = state => ({
    subMenuPoints: state.admin.subMenuPoints,
})

const mapDispatchToProps = {
    setSubMenuPoints, setPanelMenuPoints
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminMenu));