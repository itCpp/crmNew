import { withRouter } from "react-router";
import { connect } from "react-redux";
import { setSubMenuPoints, setPanelMenuPoints } from "./../../store/admin/actions";
// import { setShowMenu } from "./../../store/actions";
import { NavLink } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { useCallback, useEffect, useState, useRef } from "react";

function AdminMenu(props) {

    const { permits, setSubMenuPoints, setPanelMenuPoints } = props;
    // const { showMenu } = props;
    const [showMenu, setShowMenu] = useState(false);
    const [className, setClassName] = useState(["admin-menu slider-menu"]);
    const menu = useRef();

    // const hide = () => {
    //     props.setShowMenu(false);
    // }

    const hide = useCallback(() => setShowMenu(false));
    const show = useCallback(() => setShowMenu(true));

    useEffect(() => {

        const setShowMenuBtn = document.getElementById('set-show-menu-btn');
        setShowMenuBtn && setShowMenuBtn.addEventListener('click', show);

        return () => {
            hide();
            document.body.removeEventListener('click', hide);
            setShowMenuBtn && setShowMenuBtn.removeEventListener('click', show);
        }
    }, []);

    useEffect(() => {

        if (showMenu && className.indexOf('slider-menu-show') < 0) {
            setClassName([...className, "slider-menu-show"]);
            setTimeout(() => {
                document.body.addEventListener('click', hide);
            }, 300);
        } else if (!showMenu && className.indexOf('slider-menu-show') >= 0) {
            setClassName(["admin-menu slider-menu"]);
        }

        return () => {
            document.body.removeEventListener('click', hide);
        }

    }, [showMenu]);

    const changePage = (e) => {

        if (e.currentTarget.href.indexOf(props.location.pathname) >= 0) {
            props.history.replace(e.currentTarget.href);
        }

        setPanelMenuPoints(null);
        setSubMenuPoints(null);
    }

    return <div className={className.join(' ')} ref={menu}>

        <div className="header-menu-button mx-2 mt-1 mb-3">

            <span className="mr-3">
                <Icon
                    name="arrow left"
                    link
                    size="large"
                    className="text-light"
                />
            </span>

            <h3 className="m-0 text-light">CRM MKA</h3>

        </div>

        {(permits.block_dev || permits.admin_users) && <div className="admin-menu-block">

            <h5>Учетные записи</h5>

            {(permits.block_dev || permits.admin_users) &&
                <NavLink to="/admin/users" className="admin-menu-point" onClick={changePage}>
                    <Icon name="user" />
                    <span>Сотрудники</span>
                </NavLink>
            }

            {permits.block_dev &&
                <NavLink to="/admin/online" className="admin-menu-point" onClick={changePage}>
                    <Icon name="computer" />
                    <span>В сети</span>
                </NavLink>
            }

            {permits.admin_users_rss && <NavLink to="/admin/rss" className="admin-menu-point" onClick={changePage}>
                <Icon name="rss square" />
                <span>Рассылка</span>
            </NavLink>}

            {permits.dev_roles &&
                <NavLink to="/admin/roles" className="admin-menu-point" onClick={changePage}>
                    <Icon name="angle right" />
                    <span>Roles</span>
                </NavLink>
            }

            {permits.dev_permits &&
                <NavLink to="/admin/permits" className="admin-menu-point" onClick={changePage}>
                    <Icon name="angle right" />
                    <span>Permissions</span>
                </NavLink>
            }

        </div>}

        {permits.block_dev && <div className="admin-menu-block">

            <h5>Логи</h5>

            {permits.dev_calls && <>

                <NavLink to="/admin/calls" className="admin-menu-point" onClick={changePage}>
                    <Icon name="call" />
                    <span>Звонки</span>
                </NavLink>

                <NavLink to="/admin/events" className="admin-menu-point" onClick={changePage}>
                    <Icon name="qq" />
                    <span>Запросы событий</span>
                </NavLink>

            </>
            }

            <NavLink to="/admin/sips" className="admin-menu-point" onClick={changePage}>
                <Icon name="phone volume" />
                <span>Активность SIP</span>
            </NavLink>

        </div>}

        {permits.admin_stats && <div className="admin-menu-block">

            <h5>Статистика</h5>

            <NavLink to="/admin/expenses" className="admin-menu-point" onClick={changePage}>
                <Icon name="money" />
                <span>Расходы</span>
            </NavLink>

        </div>}

        {permits.block_dev && <div className="admin-menu-block">

            <h5>Блокировки</h5>

            <NavLink to="/admin/block/driveip" className="admin-menu-point" onClick={changePage}>
                <Icon name="ban" />
                <span>Управление IP</span>
            </NavLink>

            <NavLink to="/admin/block/drivehost" className="admin-menu-point" onClick={changePage}>
                <Icon name="ban" />
                <span>Управление Hosts</span>
            </NavLink>

            {/* <NavLink to="/admin/block/drive" className="admin-menu-point" onClick={changePage}>
                <Icon name="ban" />
                <span>Управление</span>
            </NavLink> */}

            {/* <NavLink to="/admin/block/statistic" className={`admin-menu-point ${props.location.pathname.indexOf('/admin/block/ip') >= 0 ? 'active' : ''}`} onClick={changePage}>
                <Icon name="line graph" />
                <span>Статистика</span>
            </NavLink> */}

            <NavLink to="/admin/block/allStatistic" className={`admin-menu-point ${props.location.pathname.indexOf('/admin/block/ip') >= 0 ? 'active' : ''}`} onClick={changePage}>
                <Icon name="line graph" />
                <span>Общая статистика</span>
            </NavLink>

            <NavLink to="/admin/block/sites" className="admin-menu-point" onClick={changePage}>
                <Icon name="world" />
                <span>Статистика по сайтам</span>
            </NavLink>

            <NavLink to="/admin/block/views" className="admin-menu-point" onClick={changePage}>
                <Icon name="eye" />
                <span>Просмотры</span>
            </NavLink>

            <NavLink to="/admin/databases" className="admin-menu-point" onClick={changePage}>
                <Icon name="database" />
                <span>Базы сайтов</span>
            </NavLink>

        </div>}

        {permits.block_dev && <div className="admin-menu-block">

            <h5>Настройки</h5>

            <NavLink to="/admin/settings" className="admin-menu-point" onClick={changePage}>
                <Icon name="settings" />
                <span>Глобальные настройки</span>
            </NavLink>

            <NavLink to="/admin/callcenters" className="admin-menu-point" onClick={changePage}>
                <Icon name="sound" />
                <span>Колл-центры</span>
            </NavLink>

            <NavLink to="/admin/sources" className="admin-menu-point" onClick={changePage}>
                <Icon name="fork" />
                <span>Источники</span>
            </NavLink>

            <NavLink to="/admin/sourcescheck" className="admin-menu-point" onClick={changePage}>
                <Icon name="world" />
                <span>Проверка сайтов</span>
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

            <NavLink to="/admin/gates" className="admin-menu-point" onClick={changePage}>
                <Icon name="signal" />
                <span>GSM шлюзы</span>
            </NavLink>

            <NavLink to="/admin/callsqueue" className="admin-menu-point" onClick={changePage}>
                <Icon name="random" />
                <span>Направление звоков</span>
            </NavLink>

        </div>}

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
    // showMenu: state.main.showMenu,
})

const mapDispatchToProps = {
    setSubMenuPoints,
    setPanelMenuPoints,
    // setShowMenu
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminMenu));