import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import MenuTabs from "./MenuTabs";

const Menu = props => {

    const { path } = props.match;
    const permits = window.requestPermits;
    const [selectMenu, setSelectMenu] = React.useState(path);

    React.useEffect(() => setSelectMenu(path), [path]);

    return <>

        <div className="bg-request-main-menu"></div>

        <div className="request-main-menu">

            {permits.queues_access && <Link to="/queues" className={`menu-list-row title ${selectMenu === "/queues" ? 'tab-list-active' : ''}`}>
                <div className="menu-list-point">
                    <Icon name="random" />
                    <span>Очереди</span>
                </div>
            </Link>}

            <div className="nav-bar">
                <MenuTabs
                    selectMenu={selectMenu}
                    push={props.history.push}
                />
            </div>

        </div>
    </>

}

export default withRouter(Menu);