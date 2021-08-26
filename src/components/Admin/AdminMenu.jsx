import { NavLink } from 'react-router-dom';

import { Icon } from 'semantic-ui-react';

function AdminMenu(props) {

    const { permits } = props;

    return <div className="admin-menu">

        {permits.block_dev
            ? <div className="admin-menu-block">

                <h5>Разработка</h5>

                <NavLink to="/admin/roles" className="admin-menu-point">
                    <Icon name="angle right" />
                    <span>Роли</span>
                </NavLink>

                <NavLink to="/admin/permits" className="admin-menu-point">
                    <Icon name="angle right" />
                    <span>Права</span>
                </NavLink>

            </div>
            : null
        }

    </div>

}

export default AdminMenu;