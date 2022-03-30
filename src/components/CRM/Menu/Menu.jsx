import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import MenuTabs from "./MenuTabs";
import { useDispatch, useSelector } from "react-redux";
// import { setShowMenu } from "../../../store/actions";
import { CounterRow } from "./MenuTabs";

const Menu = props => {

    const { path } = props.match;
    const permits = window.requestPermits;
    const [selectMenu, setSelectMenu] = React.useState(path);
    const { counter } = useSelector(state => state.requests);
    // const { showMenu } = useSelector(state => state.main);
    // const dispatch = useDispatch();
    const [showMenu, setShowMenu] = React.useState(false);
    const [className, setClassName] = React.useState(["request-main-menu"]);

    const hide = React.useCallback(() => setShowMenu(false));
    const show = React.useCallback(() => setShowMenu(true));

    React.useEffect(() => {

        const setShowMenuBtn = document.getElementById('set-show-menu-btn');
        setShowMenuBtn && setShowMenuBtn.addEventListener('click', show);

        return () => {
            hide();
            document.body.removeEventListener('click', hide);
            setShowMenuBtn && setShowMenuBtn.removeEventListener('click', show);
        }
    }, []);

    React.useEffect(() => {

        setSelectMenu(path);

        return () => {
            document.body.removeEventListener('click', hide);
        }
    }, [path]);

    React.useEffect(() => {

        if (showMenu && className.indexOf('slider-menu-show') < 0) {

            setClassName([...className, "slider-menu-show"]);

            setTimeout(() => {
                document.body.addEventListener('click', hide);
            }, 300);
        } else if (!showMenu && className.indexOf('slider-menu-show') >= 0) {
            setClassName(["request-main-menu"]);
        }

        return () => {
            document.body.removeEventListener('click', hide);
        }

    }, [showMenu]);

    return <div className={className.join(" ")}>

        <div className="nav-bar">
            {permits.requests_access && <MenuTabs
                selectMenu={selectMenu}
                push={props.history.push}
                replace={props.history.replace}
            />}

            {permits.rating_access && <Link to="/pins" className={`menu-list-row title ${selectMenu === "/pins" ? 'tab-list-active' : ''}`}>
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="user circle" />
                        <span>Операторы</span>
                    </span>
                </div>
            </Link>}

            {permits.rating_access && <Link to="/rating" className={`menu-list-row title ${selectMenu === "/rating" ? 'tab-list-active' : ''}`}>
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="chart bar" />
                        <span>Рейтинг</span>
                    </span>
                </div>
            </Link>}

            <Link to="/mytests" className={`menu-list-row title ${selectMenu === "/mytests" ? 'tab-list-active' : ''}`}>
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="clipboard check" />
                        <span>Мои тестирования</span>
                    </span>
                    <CounterRow count={counter?.tests || null} update={true} />
                </div>
            </Link>

            {permits.queues_access && <Link to="/queues" className={`menu-list-row title ${selectMenu === "/queues" ? 'tab-list-active' : ''}`}>
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="random" />
                        <span>Очереди</span>
                    </span>
                    <CounterRow count={counter?.queue?.count || null} />
                </div>
            </Link>}

            {permits.sms_access && <Link to="/sms" className={`menu-list-row title ${selectMenu === "/sms" ? 'tab-list-active' : ''}`}>
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="mail" />
                        <span>СМС сообщения</span>
                    </span>
                    <CounterRow count={counter?.sms?.count || null} />
                </div>
            </Link>}

            {permits.second_calls_access && <Link to="/secondcalls" className={`menu-list-row title ${selectMenu === "/secondcalls" ? 'tab-list-active' : ''}`}>
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="call" />
                        <span>Вторичные звонки</span>
                    </span>
                    <CounterRow
                        count={counter?.secondcalls?.count || null}
                        update={counter?.secondcalls?.update || null}
                    />
                </div>
            </Link>}

            {permits.clients_agreements_access && <Link to="/agreements" className={`menu-list-row title ${selectMenu === "/agreements" ? 'tab-list-active' : ''}`}>
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="file text" />
                        <span>Клиенты с договором</span>
                    </span>
                </div>
            </Link>}

        </div>

    </div>

}

export default withRouter(Menu);