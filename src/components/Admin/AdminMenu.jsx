import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { setSubMenuPoints, setPanelMenuPoints } from './../../store/admin/actions';

import { NavLink } from 'react-router-dom';

import { Icon } from 'semantic-ui-react';

function AdminMenu(props) {

    const { permits, setSubMenuPoints, setPanelMenuPoints } = props;

    const changePage = (e) => {

        if (e.currentTarget.href.indexOf(props.location.pathname) >= 0) {
            props.history.replace(e.currentTarget.href);
        }

        setPanelMenuPoints(null);
        setSubMenuPoints(null);
    }

    return <div className="admin-menu">

        {permits.block_dev
            ? <div className="admin-menu-block">

                <h5>Учетные записи</h5>

                <NavLink to="/admin/users" className="admin-menu-point" onClick={changePage}>
                    <Icon name="user" />
                    <span>Сотрудники</span>
                </NavLink>

                {/* <NavLink to="/admin/permits" className="admin-menu-point" onClick={changePage}>
                    <Icon name="angle right" />
                    <span>Сессии</span>
                </NavLink> */}

                {permits.block_dev &&
                    <NavLink to="/admin/roles" className="admin-menu-point" onClick={changePage}>
                        <Icon name="angle right" />
                        <span>Roles</span>
                    </NavLink>
                }

                {permits.block_dev &&
                    <NavLink to="/admin/permits" className="admin-menu-point" onClick={changePage}>
                        <Icon name="angle right" />
                        <span>Permissions</span>
                    </NavLink>
                }

            </div>
            : null
        }

        {permits.block_dev &&
            <div className="admin-menu-block">

                <h5>Логи</h5>

                {permits.dev_calls &&
                    <NavLink to="/admin/calls" className="admin-menu-point" onClick={changePage}>
                        <Icon name="call" />
                        <span>Звонки</span>
                    </NavLink>
                }

                <NavLink to="/admin/sips" className="admin-menu-point" onClick={changePage}>
                    <Icon name="phone volume" />
                    <span>Активность SIP</span>
                </NavLink>

            </div>
        }

        {permits.block_dev && <div className="admin-menu-block">

            <h5>Блокировки</h5>

            <NavLink to="/admin/block/drive" className="admin-menu-point" onClick={changePage}>
                <Icon name="ban" />
                <span>Управление</span>
            </NavLink>

            <NavLink to="/admin/block/statistic" className={`admin-menu-point ${props.location.pathname.indexOf('/admin/block/ip') >= 0 ? 'active' : ''}`} onClick={changePage}>
                <Icon name="line graph" />
                <span>Статистика</span>
            </NavLink>

            <NavLink to="/admin/block/sites" className="admin-menu-point" onClick={changePage}>
                <Icon name="world" />
                <span>Статистика по сайтам</span>
            </NavLink>

            <NavLink to="/admin/block/views" className="admin-menu-point" onClick={changePage}>
                <Icon name="eye" />
                <span>Просмотры</span>
            </NavLink>

        </div>}

        {permits.block_dev
            ? <div className="admin-menu-block">

                <h5>Настройки</h5>

                <NavLink to="/admin/callcenters" className="admin-menu-point" onClick={changePage}>
                    <Icon name="sound" />
                    <span>Колл-центры</span>
                </NavLink>

                <NavLink to="/admin/callsqueue" className="admin-menu-point" onClick={changePage}>
                    <Icon name="random" />
                    <span>Направление звоков</span>
                </NavLink>

                <NavLink to="/admin/sources" className="admin-menu-point" onClick={changePage}>
                    <Icon name="fork" />
                    <span>Источники</span>
                </NavLink>

                <NavLink to="/admin/statuses" className="admin-menu-point" onClick={changePage}>
                    <Icon name="certificate" />
                    <span>Статусы</span>
                </NavLink>

                <NavLink to="/admin/tabs" className="admin-menu-point" onClick={changePage}>
                    <Icon name="table" />
                    <span>Вкладки</span>
                </NavLink>

                <NavLink to="/admin/office" className="admin-menu-point" onClick={changePage}>
                    <Icon name="building" />
                    <span>Офисы</span>
                </NavLink>

            </div>
            : null
        }

        {permits.block_dev && <div className="admin-menu-block">

            <h5>API</h5>

            <NavLink to="/admin/routes" className="admin-menu-point" onClick={changePage}>
                <Icon name="road" />
                <span>Маршрутизация</span>
            </NavLink>

        </div>}

    </div>

}

const mapStateToProps = state => ({
    subMenuPoints: state.admin.subMenuPoints,
})

const mapDispatchToProps = {
    setSubMenuPoints, setPanelMenuPoints
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminMenu));