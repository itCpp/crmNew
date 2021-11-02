import React from "react";

import MenuTabs from "./MenuTabs";

const Menu = props => {

    return <>

        <div className="bg-request-main-menu"></div>

        <div className="request-main-menu">

            <div className="nav-bar">

                <MenuTabs />

            </div>

        </div>
    </>

}

export default Menu;