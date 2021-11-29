import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import MenuTabs from "./MenuTabs";
import { useSelector } from "react-redux";
import { CounterRow } from "./MenuTabs";

const Menu = props => {

    const { path } = props.match;
    const permits = window.requestPermits;
    const [selectMenu, setSelectMenu] = React.useState(path);
    const { counter } = useSelector(state => state.requests);

    React.useEffect(() => setSelectMenu(path), [path]);

    return <>

        <div className="bg-request-main-menu"></div>

        <div className="request-main-menu">

            <div className="nav-bar">
                <MenuTabs
                    selectMenu={selectMenu}
                    push={props.history.push}
                    replace={props.history.replace}
                />

                <Link to="/pins" className={`menu-list-row title ${selectMenu === "/pins" ? 'tab-list-active' : ''}`}>
                    <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                        <span>
                            <Icon name="user circle" />
                            <span>Операторы</span>
                        </span>
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
            </div>

        </div>
    </>

}

export default withRouter(Menu);